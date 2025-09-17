const { Product } = require("../../models/product/Product");
const { Variant } = require("../../models/product/Variant");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ProductSearchAndFilter = require("../../utils/productSearchAndFilter");
const {
  isOnlyDigits,
  formatJoiErrMessage,
  generateSKU,
} = require("../../utils/helpers");
const { uploadToImageKit, imagekit } = require("../../utils/uploadImages");
const {
  variantJoiSchema,
  imagesJoiSchema,
} = require("../../validators/product/variantValidator");
const { deletionQueue } = require("../../jobs/queue");

// ======================= ADMIN -- Common Works For Create Variant and Update Variant ==============================
const formatImages = (files, imgs, edit) => {
  /*
      /images\[(\d+)\]\[files\]/ → this regex has one pair of parentheses (\d+).

      That pair tells JavaScript: capture the digits that appear between images[ and ][files].

      When .match() runs, it returns an array like:

      ["images[3][files]", "3"]

      match[1] = the part captured by (\d+): "3".
    
    */

  const grouped = {};

  files.forEach((file) => {
    const match = file.fieldname.match(/images\[(\d+)\]\[files\]/);
    if (match) {
      const index = match[1];
      if (!grouped[index]) {
        grouped[index] = {
          color: imgs[index].color,
          files: [],
        };
      }
      grouped[index].files.push(file);
    }
  });

  let images;

  if (edit) {
    images = imgs.map((img, index) => {
      if(img.files){
        const parsedFiles = img.files.map((file) => JSON.parse(file));
        if (grouped[index]) {
          return {
            color: grouped[index].color,
            files: [...parsedFiles, ...grouped[index].files],
          };
        } else {
          return {
            color: img.color,
            files: parsedFiles,
          };
        }
      }else{
        return {
          color: img.color,
          files: grouped[index].files
        }
      }
    });
  } else {
    images = Object.keys(grouped).map((key) => {
      return { color: grouped[key].color, files: grouped[key].files };
    });
  }
  return images;
};

const contentValidation = async (req, next, edit = false) => {
  req.body.attributes = JSON.parse(req.body.attributes);

  const { price, stock, attributes } = req.body;

  const { productId } = req.params;

  const product = await Product.findById(productId).populate("category");

  if (!product) {
    return next(new ErrorHandler("product not exists", 404));
  }

  const { error } = variantJoiSchema.validate({
    price,
    stock,
    attributes,
  });

  if (error) {
    return next(new ErrorHandler(formatJoiErrMessage(error), 400));
  }

  const images = formatImages(req.files, req.body.images, edit);

  const { error: imagesError } = imagesJoiSchema.validate({ images });

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
    if (definedAttr.type === "string" && typeof attr.value !== "string") {
      return next(new ErrorHandler(`invalid attribute value - ${attr.value}`));
    }
    if (definedAttr.type === "enum" && !Array.isArray(attr.value)) {
      return next(new ErrorHandler(`invalid attribute value - ${attr.value}`));
    }
  }
  return { price, stock, attributes, productId, images };
};

const uploadImagesToImageKit = async (images, productId, variantId) => {
  const uploadedImages = await Promise.all(
    images.map(async (img) => {
      const files = await Promise.all(
        img.files.map(async (file) => {
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
        files,
      };
    })
  );

  return uploadedImages;
};

// ======================= ADMIN -- CREATE NEW VARIANT ==============================
exports.createNewVariant = catchAsyncErrors(async (req, res, next) => {
  const { price, stock, attributes, productId, images } =
    await contentValidation(req, next);

  const dummyImagesData = [
    {
      color: "default",
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
    price,
    stock,
    attributes,
    sku,
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
      variant._id
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

  const { price, stock, attributes, productId, images } =
    await contentValidation(req, next, true);

  const { removedImagesFileIds } = req.body;

  // if imagekit image fileids exists
  if (removedImagesFileIds && removedImagesFileIds !== "") {
    // convert into array
    const fileIds = removedImagesFileIds.split(",");

    if (fileIds.length > 0) {
      // run delete function of each imagekit file id
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
        variant._id
      );

      await Variant.findByIdAndUpdate(
        variant._id,
        {
          price,
          stock,
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
        price,
        stock,
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

// ======================= ADMIN -- GET ALL VARIANTS - {imagesUploaded:true} ==============================
exports.getAllVariants = catchAsyncErrors(async (req, res, next) => {
  const variants = await Variant.find({
    product: req.params.productId,
    imagesUploaded: true,
  });

  res.status(200).json({
    variants,
    success: true,
  });
});

//   await imagekit.deleteFolder(
//   `${process.env.PRODUCT_PICS_FOLDER}/${product._id}`
// );

//   // ======================= ADMIN -- GET IN STOCK AND OUT OF STOCK PRODUCT COUNT ==============================
// exports.getInStockAndOutOfStockProductCount = catchAsyncErrors(
//   async (req, res, next) => {
//     const result = await Product.aggregate([
//       // Create a flag field based on stock
//       {
//         $addFields: {
//           status: {
//             $cond: [
//               { $gt: ["$stock", 0] }, // condition
//               "in_stock", // if true
//               "out_of_stock", // if false
//             ],
//           },
//         },
//       },

//       // Group by status and count
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 },
//         },
//       },

//       // Reshape into single document
//       {
//         $group: {
//           _id: null,
//           in_stock: {
//             $sum: {
//               $cond: [{ $eq: ["$_id", "in_stock"] }, "$count", 0],
//             },
//           },
//           out_of_stock: {
//             $sum: {
//               $cond: [{ $eq: ["$_id", "out_of_stock"] }, "$count", 0],
//             },
//           },
//         },
//       },

//       // Clean up
//       {
//         $project: {
//           _id: 0,
//           in_stock: 1,
//           out_of_stock: 1,
//         },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       stockStatus: result[0],
//     });
//   }
// );

// // ======================= GET ALL TOTAL NUMBER OF PRODUCTS ==============================
// exports.getTotalNumberOfProducts = catchAsyncErrors(async (req, res) => {
//   const totalProducts = await Product.countDocuments();

//   res.status(200).json({
//     success: true,
//     totalProducts,
//   });
// });

// // ======================= GET ALL PRODUCTS ==============================
// exports.getAllProducts = catchAsyncErrors(async (req, res) => {
//   const resultPerPage = 10;
//   const productsCount = await Product.countDocuments();

//   let products = new ProductSearchAndFilter(Product, req.query)
//     .search()
//     .filter()
//     .pagination(resultPerPage);

//   products = await products.query;

//   res.status(200).json({
//     success: true,
//     products,
//     productsCount,
//   });
// });
