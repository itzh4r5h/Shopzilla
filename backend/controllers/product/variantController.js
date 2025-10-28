const { Product } = require("../../models/product/Product");
const { Variant } = require("../../models/product/Variant");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const {
  formatJoiErrMessage,
  generateSKU,
  isOnlyDigits,
} = require("../../utils/helpers");
const { uploadToImageKit, imagekit } = require("../../utils/uploadImages");
const {
  variantJoiSchema,
  imagesJoiSchema,
  stockJoiSchema,
} = require("../../validators/product/variantValidator");
const { deletionQueue } = require("../../jobs/queue");
const mongoose = require("mongoose");

// ======================= ADMIN -- Common Works For Create Variant and Update Variant ==============================
const formatImages = (files, imgs, edit, needSize) => {
  /*
    this function takes the req.files and images from req.body and edit with value of true or false
    then it forms an array of images 
    [{color: 'clr', files: [{}]},]
  */

  const grouped = {};
  files.forEach((file) => {
    /*
      /images\[(\d+)\]\[files\]/ → this regex has one pair of parentheses (\d+).

      That pair tells JavaScript: capture the digits that appear between images[ and ][files].

      When .match() runs, it returns an array like:

      ["images[3][files]", "3"]

      match[1] = the part captured by (\d+): "3".
    
    */
    const match = file.fieldname.match(/images\[(\d+)\]\[files\]/);
    if (match) {
      const index = match[1];
      // if index not in grouped
      if (!grouped[index]) {
        grouped[index] = {
          color: imgs[index].color,
          price: imgs[index].price,
          ...(needSize
            ? { sizes: imgs[index].sizes }
            : { stock: imgs[index].stock }),
          files: [],
        };
        // it will result in i.e. {"0": {color: 'clr', files : []}}
      }
      grouped[index].files.push(file);
    }
  });
  /*
    after the loop grouped will be like this 
    {
     "0": {
        color: 'clr_hex_code',
        files: [file,file]
     },
     "1": {
        color: 'clr_hex_code',
        files: [file,file]
     }
    }
  */

  let images;
  // if edit is true
  if (edit) {
    // run map on imgs we get from req.body
    images = imgs.map((img, index) => {
      /*
      img will have {color,files} sometimes only {color}
      */
      //  checking if img has files
      if (img.files) {
        /*
         from frontend files will be stringify using json and it holds values like
      ['{url:'img_url',fileId:'imageKit_fileId',name:'orignal_name'},'] as these are already uploaded files to imagekit
        so we are parsing every file object one by one usong JSON.parse
         */
        const parsedFiles = img.files.map((file) => JSON.parse(file));

        /*
        eventhough we are in edit mode but if we got new files
        then we are checking if grouped has that index available
        */
        if (grouped[index]) {
          /*
          then return the value e.g
        {
          color: 'clr',
          price: 1000,
          stock: 10
          files: [{url:'img_url',fileId:'imageKit_fileId',name:'orignal_name'},File,]
          }
          */
          return {
            color: grouped[index].color,
            price: grouped[index].price,
            ...(needSize
              ? { sizes: grouped[index].sizes }
              : { stock: grouped[index].stock }),
            files: [...parsedFiles, ...grouped[index].files],
          };
        } else {
          // if not then we gonna only return the already uploaded files in file field
          return {
            color: img.color,
            price: img.price,
            ...(needSize ? { sizes: img.sizes } : { stock: img.stock }),
            files: parsedFiles,
          };
        }
      } else {
        //  if img has not files field
        // then return files stored in grouped
        return {
          color: img.color,
          price: img.price,
          ...(needSize ? { sizes: img.sizes } : { stock: img.stock }),
          files: grouped[index].files,
        };
      }
    });
  } else {
    // if not in edit
    /*
      Object.key(grouped) will give the keys array ["0","1","2"]
    */
    images = Object.keys(grouped).map((key) => {
      return {
        color: grouped[key].color,
        price: grouped[key].price,
        ...(needSize
          ? { sizes: grouped[key].sizes }
          : { stock: grouped[key].stock }),
        files: grouped[key].files,
      };
    });
  }
  return images;
};

const contentValidation = async (req, next, edit = false) => {
  /*
    this function is used in both create and updated variant
    it will validate the data which received from frontend
  */
  req.body.attributes = JSON.parse(req.body.attributes);
  req.body.needSize = JSON.parse(req.body.needSize);

  const { attributes, needSize } = req.body;

  if (typeof needSize !== "boolean") {
    return next(new ErrorHandler("need size is required"));
  }

  const { productId } = req.params;

  const product = await Product.findById(productId).populate("category");

  if (!product) {
    return next(new ErrorHandler("product not exists", 404));
  }

  const { error } = variantJoiSchema.validate({ attributes });

  if (error) {
    return next(new ErrorHandler(formatJoiErrMessage(error), 400));
  }

  const images = formatImages(req.files, req.body.images, edit, needSize);

  const { error: imagesError } = imagesJoiSchema.validate({ needSize, images });

  if (imagesError) {
    return next(new ErrorHandler(formatJoiErrMessage(imagesError), 400));
  }

  const subcategory = product.category.subcategories.find(
    (subcat) => subcat.name === product.subcategory
  );

  if (attributes.length !== subcategory.attributes.length) {
    return next(new ErrorHandler("required attriubtes not given"));
  }

  // validates variant attribute with existing subcategory attributes
  for (const attr of attributes) {
    const definedAttr = subcategory.attributes.find(
      (attribute) => attribute.name === attr.name
    );

    if (!definedAttr) {
      return next(new ErrorHandler("invalid attribute name"));
    }
  }
  return { attributes, productId, images, needSize };
};

const uploadImagesToImageKit = async (
  images,
  productId,
  variantId,
  needSize
) => {
  /*
   it will upload the images to imagekit and it is used in both create and update variant function
   the images it received are those images we formated earlier in formatImages function
   */
  const uploadedImages = await Promise.all(
    // running map function on each image as every image hold files array
    images.map(async (img) => {
      const files = await Promise.all(
        img.files.map(async (file) => {
          /*
            checking if image has two fields buffer and mimetype
            as we have upload only those images which are not uploaded
            as we know images - files can contain values like url, fileId, name instead of actual File object
          */
          if ("buffer" in file || "mimetype" in file) {
            const { buffer, originalname } = file;

            const { url, fileId } = await uploadToImageKit(
              buffer,
              originalname,
              `${process.env.PRODUCT_PICS_FOLDER}/${productId}/${variantId}`
            );

            return {
              url,
              fileId,
              name: originalname.split(".")[0],
            };
          } else {
            return file;
          }
        })
      );
      return {
        color: img.color,
        price: img.price,
        ...(needSize ? { sizes: img.sizes } : { stock: img.stock }),
        files,
      };
    })
  );

  return uploadedImages;
};

// ======================= ADMIN -- CREATE NEW VARIANT ==============================
exports.createNewVariant = catchAsyncErrors(async (req, res, next) => {
  const { attributes, productId, images, needSize } = await contentValidation(
    req,
    next
  );

  const dummyImagesData = [
    {
      color: "default",
      price: 1,
      stock: 1,
      files: [
        {
          url: "fake",
          fileId: "fake",
          name: "fake",
        },
      ],
    },
  ];

  const sku = generateSKU(productId, attributes);

  const variant = await Variant.create({
    attributes,
    sku,
    needSize,
    images: dummyImagesData,
    product: productId,
  });

  res.status(201).json({
    success: true,
    message: "variant creation started",
  });

  // Schedule job to delete variant if there is an error while uploading images after specified minutes
  await deletionQueue.add(
    "delete-images",
    { variantId: variant._id },
    {
      delay: process.env.VARIANT_DELETION_MINUTES * 60 * 1000 + 3000,
      jobId: `delete-images-${variant._id}`,
    }
  );

  (async () => {
    const uploadedImages = await uploadImagesToImageKit(
      images,
      productId,
      variant._id,
      needSize
    );

    await Variant.findByIdAndUpdate(
      variant._id,
      { images: uploadedImages, imagesUploaded: true },
      { new: true, runValidators: true }
    );

    // if images uploaded successfully then delete the job
    const job = await deletionQueue.getJob(`delete-images-${variant._id}`);
    if (job) {
      await job.remove();
      console.log(`Job for variant ${variant._id} deleted successfully`);
    }

    // Lookup socketId from userId
    const socketId = global._userSockets[req.user._id];
    if (socketId && global._io) {
      global._io.to(socketId).emit("productImagesUploaded", {
        message: "variant created",
        id: productId,
      });
    }
  })();
});

// ======================= ADMIN -- UPDATE VARIANT ==============================
exports.updateVariant = catchAsyncErrors(async (req, res, next) => {
  const variant = await Variant.findById(req.params.id);

  if (!variant) {
    return next(new ErrorHandler("variant not exists", 404));
  }

  const { attributes, productId, images, needSize } = await contentValidation(
    req,
    next,
    true
  );

  const { removedImagesFileIds } = req.body;

  // if imagekit image fileids exists
  if (removedImagesFileIds && removedImagesFileIds !== "") {
    // convert into array
    const fileIds = removedImagesFileIds.split(",");

    if (fileIds.length > 0) {
      // run delete function on each imagekit file id
      await Promise.all(fileIds.map((id) => imagekit.deleteFile(id)));
    }
  }

  if (req.files.length > 0) {
    res.status(200).json({
      success: true,
      message: "updating variant...",
    });
    // this will run in the background if req.files have any file to upload on imagekit
    (async () => {
      const uploadedImages = await uploadImagesToImageKit(
        images,
        productId,
        variant._id,
        needSize
      );

      await Variant.findByIdAndUpdate(
        variant._id,
        {
          attributes,
          images: uploadedImages,
        },
        { new: true, runValidators: true }
      );

      // Lookup socketId from userId
      const socketId = global._userSockets[req.user._id];
      if (socketId && global._io) {
        global._io.to(socketId).emit("productImagesUploaded", {
          message: "variant updated",
          id: productId,
        });
      }
    })();
  } else {
    await Variant.findByIdAndUpdate(
      variant._id,
      {
        attributes,
        images,
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      message: "variant updated",
    });
  }
});

// ======================= ADMIN -- GET ALL VARIANTS OF A PRODUCT ==============================
exports.getAllVariantsOfAProduct = catchAsyncErrors(async (req, res, next) => {
  const variants = await Variant.find({
    product: req.params.productId,
    imagesUploaded: true,
  });

  res.status(200).json({
    variants,
    success: true,
  });
});

// ======================= ADMIN -- DELETE VARIANT ==============================
exports.deleteVariant = catchAsyncErrors(async (req, res, next) => {
  const variant = await Variant.findByIdAndDelete(req.params.id);

  if (!variant) {
    return next(new ErrorHandler("variant not exists", 404));
  }

  await imagekit.deleteFolder(
    `${process.env.PRODUCT_PICS_FOLDER}/${req.params.productId}/${req.params.id}`
  );

  res.status(200).json({
    success: true,
    message: "variant deleted",
  });
});

//   // ======================= ADMIN -- GET IN STOCK AND OUT OF STOCK PRODUCT COUNT ==============================
exports.getInStockAndOutOfStockVariantCount = catchAsyncErrors(
  async (req, res, next) => {
    const result = await Variant.aggregate([
      // Only include variants whose imagesUploaded is true
      {
        $match: { imagesUploaded: true },
      },
      // Break out images array so we can access price/stock
      { $unwind: "$images" },

      // Handle two cases:
      // Case 1: image has sizes array
      // Case 2: image has direct stock
      {
        $addFields: {
          sizesExist: { $isArray: "$images.sizes" },
        },
      },

      // If sizes exist, unwind them; otherwise keep single image
      {
        $unwind: {
          path: "$images.sizes",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Compute stock depending on whether sizes exist
      {
        $addFields: {
          actualStock: {
            $cond: [
              { $ifNull: ["$images.sizes", false] },
              "$images.sizes.stock",
              "$images.stock",
            ],
          },
        },
      },

      // Create in_stock/out_of_stock flag
      {
        $addFields: {
          status: {
            $cond: [{ $gt: ["$actualStock", 0] }, "in_stock", "out_of_stock"],
          },
        },
      },

      // Group by status and count
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },

      // Reshape into single document
      {
        $group: {
          _id: null,
          in_stock: {
            $sum: {
              $cond: [{ $eq: ["$_id", "in_stock"] }, "$count", 0],
            },
          },
          out_of_stock: {
            $sum: {
              $cond: [{ $eq: ["$_id", "out_of_stock"] }, "$count", 0],
            },
          },
        },
      },

      // Clean up
      {
        $project: {
          _id: 0,
          in_stock: 1,
          out_of_stock: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stockStatus: result[0],
    });
  }
);

// ======================= ADMIN - GET ALL TOTAL NUMBER OF VARIANTS ==============================
exports.getTotalNumberOfVariants = catchAsyncErrors(async (req, res) => {
  const totalVariants = await Variant.countDocuments({ imagesUploaded: true });

  res.status(200).json({
    success: true,
    totalVariants,
  });
});

// ======================= GET VARIANT ==============================
exports.getVariant = catchAsyncErrors(async (req, res, next) => {
  const variant = await Variant.findOne({
    _id: req.params.id,
    imagesUploaded: true,
  }).populate("product");

  if (!variant) {
    return next(new ErrorHandler("variant not exists", 404));
  }

  res.status(200).json({
    variant,
    success: true,
  });
});

// ======================= GET ALL VARIANTS ==============================
exports.getFilterOptionsBasedOnSearchedProduct = catchAsyncErrors(
  async (req, res, next) => {
    const { keyword } = req.query;

    if (!keyword || keyword.toString().trim() === "") {
      return next(new ErrorHandler("keyword is required"));
    }

    const pipeline = [
      // Basic condition (images uploaded)
      { $match: { imagesUploaded: true } },

      // Join product
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      // Break out images array so we can filter on price/stock
      { $unwind: "$images" },

      // Keyword search (on product.name)
      { $match: { "product.name": { $regex: keyword, $options: "i" } } },

      // Facet for data + filters
      {
        $facet: {
          filterOptions: [
            {
              $group: {
                _id: null,
                brands: { $addToSet: "$product.brand" },
                subcategories: { $addToSet: "$product.subcategory" },
                minPrice: { $min: "$images.price" },
                maxPrice: { $max: "$images.price" },
              },
            },
            {
              $project: {
                _id: 0,
                brands: 1,
                subcategories: 1,
                prices: ["$minPrice", "$maxPrice"],
              },
            },
          ],

          attributesOptions: [
            { $unwind: "$attributes" },
            {
              $group: {
                _id: "$attributes.name",
                values: { $addToSet: "$attributes.value" },
              },
            },
          ],
        },
      },
      {
        $project: {
          filters: { $arrayElemAt: ["$filterOptions", 0] },
          attributes: "$attributesOptions",
        },
      },
    ];

    const [result] = await Variant.aggregate(pipeline);

    res.json({
      success: true,
      filters: result?.filters || {
        brands: [],
        categories: [],
        subcategories: [],
        prices: [],
      },
      attributes: result?.attributes || [],
    });
  }
);

//====================== COMMON PIPELINE STAGES =============================

const initialStage = () => {
  return [
    // Basic condition (images uploaded)
    { $match: { imagesUploaded: true } },

    // Join product
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    // Break out images array so we can filter on price/stock
    { $unwind: { path: "$images", includeArrayIndex: "originalIndex" } },
  ];
};

const variantStage = (page, limit) => {
  const stages = [
    {
      $group: {
        _id: "$_id",
        doc: { $first: "$$ROOT" }, // take variant fields
        images: { $push: "$images" }, // re-collect images
        originalIndex: { $first: "$originalIndex" }, // preserve original image index
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            "$doc",
            { images: "$images", originalIndex: "$originalIndex" },
          ],
        },
      },
    },
    {
      $set: {
        // Create an array of numbers equal to number of images
        selectedIndexes: {
          $map: {
            input: { $range: [0, { $size: "$images" }] },
            as: "i",
            in: {
              $mergeObjects: ["$$ROOT", { selectedProduct: "$$i" }],
            },
          },
        },
      },
    },
    // 👇 flatten it (each element becomes separate variant)
    { $unwind: "$selectedIndexes" },
    // 👇 make that flattened object the actual root
    { $replaceRoot: { newRoot: "$selectedIndexes" } },
    // sort docs
    { $sort: { createdAt: -1, _id: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  return stages;
};

const lastFacetStage = (page, limit) => {
  return [
    // Facet for data + filters
    {
      $facet: {
        metadata: [{ $count: "total" }],
        variants: variantStage(page, limit),
      },
    },
    {
      $project: {
        totalPages: {
          $ceil: {
            $divide: [
              { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] },
              limit,
            ],
          },
        },
        variants: "$variants",
      },
    },
  ];
};

// ======================= GET ALL FILTERED VARIANTS ==============================
exports.getAllVariants = catchAsyncErrors(async (req, res) => {
  const { subcategory, brand, ratings, minPrice, maxPrice } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = 10;

  const keyword = req.query.keyword || "";

  const attributes = req.query.attributes
    ? JSON.parse(req.query.attributes)
    : false;

  const pipeline = [
    ...initialStage(),

    // Keyword search (on product.name)
    { $match: { "product.name": { $regex: keyword, $options: "i" } } },

    // Product-level filters
    ...(subcategory
      ? [{ $match: { "product.subcategory": subcategory } }]
      : []),

    ...(brand ? [{ $match: { "product.brand": brand } }] : []),

    ...(isOnlyDigits(ratings)
      ? [{ $match: { "product.ratings": { $gte: Number(ratings) } } }]
      : []),

    // Variant-level filters
    ...((minPrice && isOnlyDigits(minPrice)) ||
    (maxPrice && isOnlyDigits(maxPrice))
      ? [
          {
            $match: {
              "images.price": {
                ...(minPrice && { $gte: Number(minPrice) }),
                ...(maxPrice && { $lte: Number(maxPrice) }),
              },
            },
          },
        ]
      : []),

    ...(attributes?.length > 0
      ? [
          {
            $match: {
              attributes: {
                $elemMatch: {
                  $or: attributes.map(({ name, value }) => ({ name, value })),
                },
              },
            },
          },
        ]
      : []),

    ...lastFacetStage(page, limit),
  ];

  const [result] = await Variant.aggregate(pipeline);

  res.json({
    success: true,
    totalPages: result?.totalPages || 0,
    variants: result?.variants || [],
  });
});

// ======================= GET OUT OF STOCK VARIANTS ==============================
exports.getOutOfStockVariants = catchAsyncErrors(async (req, res) => {
  const { brand, ratings } = req.query;

  const category = req.query.category ? JSON.parse(req.query.category) : false;

  const page = Number(req.query.page) || 1;
  const limit = 10;

  const keyword = req.query.keyword || "";

  const pipeline = [
    ...initialStage(),

    // Handle both needSize = true/false to get out-of-stock variants
    {
      $match: {
        $or: [
          // For needSize false → directly check stock field
          { needSize: false, "images.stock": { $lte: 0 } },

          // For needSize true → at least one size out of stock
          {
            needSize: true,
            $expr: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: "$images.sizes",
                      as: "s",
                      cond: { $eq: ["$$s.stock", 0] },
                    },
                  },
                },
                0,
              ],
            },
          },
        ],
      },
    },

    // Keyword search (on product.name)
    { $match: { "product.name": { $regex: keyword, $options: "i" } } },

    // Product-level filters
    ...(category?._id
      ? [
          {
            $match: {
              "product.category": new mongoose.Types.ObjectId(category._id),
            },
          },
        ]
      : []),

    ...(category?.subcategory
      ? [
          {
            $match: {
              "product.subcategory": category.subcategory,
            },
          },
        ]
      : []),

    ...(brand ? [{ $match: { "product.brand": brand } }] : []),

    ...(isOnlyDigits(ratings)
      ? [{ $match: { "product.ratings": { $gte: Number(ratings) } } }]
      : []),

    ...lastFacetStage(page, limit),
  ];

  const [result] = await Variant.aggregate(pipeline);

  res.json({
    success: true,
    totalPages: result?.totalPages || 0,
    out_of_stock_variants: result?.variants || [],
  });
});

// ======================= ADMIN - UPDATE VARIANT STOCK ==============================
exports.updateVariantStock = catchAsyncErrors(async (req, res,next) => {
  const variant = await Variant.findById(req.params.id);
  const { stock, sizes, originalIndex, needSize } = req.body;

  if (!variant) {
    return next(new ErrorHandler("variant not exists"));
  }

  const { error } = stockJoiSchema.validate({
    needSize,
    originalIndex,
    stock,
    sizes,
  });

  if (error) {
    return next(new ErrorHandler(formatJoiErrMessage(error), 400));
  }

  if (needSize) {
    variant.images[originalIndex].sizes.forEach((sz, index) => {
      if (sz.stock === 0) {
        const result = sizes.filter(
          (sze) => sze.size.toLowerCase() === sz.size.toLowerCase()
        )[0];

        sz.stock = result.stock;
      }
    });
  } else {
    variant.images[originalIndex].stock = stock;
  }

  await variant.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: "stock updated",
  });
});
