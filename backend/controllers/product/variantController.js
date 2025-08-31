const { Product } = require("../../models/product/Product");
const { Variant } = require("../../models/product/Variant");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ProductSearchAndFilter = require("../../utils/productSearchAndFilter");
const { isOnlyDigits, formatJoiErrMessage } = require("../../utils/helpers");
const { uploadToImageKit, imagekit } = require("../../utils/uploadImages");
const {
  variantJoiSchema,
} = require("../../validators/product/variantValidator");

// ======================= ADMIN -- CREATE NEW VARIANT ==============================
exports.createNewVariant = catchAsyncErrors(async (req, res, next) => {
  const { variant, productId } = req.body;

  if (!productId || productId.toString().trim() === "") {
    return next(new ErrorHandler("product id is required"));
  }

  const product = await Product.findById(productId).populate("category");

  if (!product) {
    return next(new ErrorHandler("product not exists", 404));
  }

  const { error } = variantJoiSchema.validate(variant);

  if (error) {
    return next(new ErrorHandler(formatJoiErrMessage(error), 400));
  }

  const subcategory = product.category.subcategories.find(
    (subcat) => subcat.name === product.subcategory
  );


  if(variant.attributes.length !== subcategory.attributes.length){
    return next(new ErrorHandler('required attriubtes not given'))
  }

  // validates variant attribute with existing subcategory attributes
  for (const attr of variant.attributes) {
    const definedAttr = subcategory.attributes.find(
      (attribute) => attribute.name === attr.name
    );

    if (!definedAttr) {
      return next(new ErrorHandler("invalid attribute name"));
    }

    if (definedAttr.type === "number" && typeof attr.value !== "number") {
      return next(new ErrorHandler(`invalid attribute value - ${attr.value}`));
    }
    if (definedAttr.type === "string" && typeof attr.value !== "string") {
      return next(new ErrorHandler(`invalid attribute value - ${attr.value}`));
    }
    if (definedAttr.type === "enum" && !Array.isArray(attr.value)) {
      return next(new ErrorHandler(`invalid attribute value - ${attr.value}`));
    }

  }

  const images = [
    {
      files: [
        {
          url: 'fake',
          fileId: 'fake',
          name: 'fake'
        }
      ]
    }
  ]

  console.log(req.body,req.files);

  // await Variant.create({...variant,images,product:productId});

  res.status(201).json({
    success: true,
    message: "variant creation started",
  });

  // (async () => {
  //   const uploadedImages = await Promise.all(
  //     req.files.map(async (image) => {
  //       const { buffer, originalname } = image;

  //       const { url, fileId } = await uploadToImageKit(
  //         buffer,
  //         originalname,
  //         `${process.env.PRODUCT_PICS_FOLDER}/${product._id}`
  //       );

  //       return {
  //         url,
  //         fileId,
  //         name: originalname.split(".")[0],
  //       };
  //     })
  //   );

  //   await Product.create({ ...data, images: uploadedImages });

  //   // Lookup socketId from userId
  //   const socketId = global._userSockets[req.user._id];
  //   if (socketId && global._io) {
  //     global._io.to(socketId).emit("productImagesUploaded", {
  //       message: "product created",
  //     });
  //   }
  // })();
});


  // // if imagekit image fileids exists
  // if (removedImagesFileIds) {
  //   // then convert into array
  //   const fileIds = removedImagesFileIds.split(",");

  //   // after deleting images on imagekit
  //   // keep those images whose fileid not in fileIds array
  //   const productImages = product.images.filter(
  //     (img) => !fileIds.includes(img.fileId)
  //   );

  //   // update product images array
  //   product.images = [...productImages];
  //   await product.save({ validateBeforeSave: true });

  //   // run delete function of each imagekit file id
  //   await Promise.all(fileIds.map((id) => imagekit.deleteFile(id)));
  // }


  // // this will run in the background if req.files have any file to upload on imagekit
  // (async () => {
  //   if (req.files.length > 0) {
  //     const uploadedImages = await Promise.all(
  //       req.files.map(async (image) => {
  //         const { buffer, originalname } = image;

  //         const { url, fileId } = await uploadToImageKit(
  //           buffer,
  //           originalname,
  //           `${process.env.PRODUCT_PICS_FOLDER}/${product._id}`
  //         );

  //         return {
  //           url,
  //           fileId,
  //           name: originalname.split(".")[0],
  //         };
  //       })
  //     );

  //     await Product.findByIdAndUpdate(
  //       product._id,
  //       {
  //         images: [...product.images, ...uploadedImages],
  //         imagesUploaded: true,
  //       },
  //       { new: true, runValidators: true }
  //     );

  //     // Lookup socketId from userId
  //     const socketId = global._userSockets[req.user._id];
  //     if (socketId && global._io) {
  //       global._io.to(socketId).emit("productImagesUploaded", {
  //         message: "product updated",
  //       });
  //     }
  //   }
  // })();


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
