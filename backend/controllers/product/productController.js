const { Product } = require("../../models/Product");
const { joiValidator } = require("../../validators/productValiators");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ProductSearchAndFilter = require("../../utils/productSearchAndFilter");
const { isOnlyDigits } = require("../../utils/helpers");
const { uploadToImageKit, imagekit } = require("../../utils/uploadImages");

// ======================= ADMIN -- CREATE PRODUCT ==============================
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const { images, ...data } = req.body;

  const error = joiValidator({ ...data, images: req.files });
  if (error) {
    let msg = error.message.replaceAll('"', "");
    return next(new ErrorHandler(msg, 400));
  }

  data.user = req.user._id;

  const fakeImageData = [
    {
      url: "fake",
      fileId: "fake",
      name: "fake",
    },
  ];

  const product = await Product.create({ ...data, images: fakeImageData });

  res.status(201).json({
    success: true,
    message: "product creation started",
  });

  (async () => {
    const uploadedImages = await Promise.all(
      req.files.map(async (image) => {
        const { buffer, originalname } = image;

        const { url, fileId } = await uploadToImageKit(
          buffer,
          originalname,
          `${process.env.PRODUCT_PICS_FOLDER}/${product._id}`
        );

        return {
          url,
          fileId,
          name: originalname.split(".")[0],
        };
      })
    );

    await Product.findByIdAndUpdate(
      product._id,
      { images: uploadedImages, imagesUploaded: true },
      { new: true, runValidators: true }
    );

    // Lookup socketId from userId
    const socketId = global._userSockets[req.user._id];
    if (socketId && global._io) {
      global._io.to(socketId).emit("productImagesUploaded", {
        message: "product created",
      });
    }
  })();
});

// ======================= ADMIN -- UPDATE PRODUCT ==============================
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const { removedImagesFileIds, id, ...data } = req.body;

  // if imagekit image fileids exists
  if (removedImagesFileIds) {
    // then convert into array
    const fileIds = removedImagesFileIds.split(",");

    // after deleting images on imagekit
    // keep those images whose fileid not in fileIds array
    const productImages = product.images.filter(
      (img) => !fileIds.includes(img.fileId)
    );

    // update product images array
    product.images = [...productImages];
    await product.save({ validateBeforeSave: true });

    // run delete function of each imagekit file id
    await Promise.all(fileIds.map((id) => imagekit.deleteFile(id)));
  }

  // updating product basic details - name, description, price, stock and category
  await Product.findByIdAndUpdate(
    product._id,
    { ...data, imagesUploaded: req.files.length === 0 },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message:
      req.files.length > 0 ? "product updation started" : "product updated",
  });

  // this will run in the background if req.files have any file to upload on imagekit
  (async () => {
    if (req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map(async (image) => {
          const { buffer, originalname } = image;

          const { url, fileId } = await uploadToImageKit(
            buffer,
            originalname,
            `${process.env.PRODUCT_PICS_FOLDER}/${product._id}`
          );

          return {
            url,
            fileId,
            name: originalname.split(".")[0],
          };
        })
      );

      await Product.findByIdAndUpdate(
        product._id,
        {
          images: [...product.images, ...uploadedImages],
          imagesUploaded: true,
        },
        { new: true, runValidators: true }
      );

      // Lookup socketId from userId
      const socketId = global._userSockets[req.user._id];
      if (socketId && global._io) {
        global._io.to(socketId).emit("productImagesUploaded", {
          message: "product updated",
        });
      }
    }
  })();
});

// ======================= ADMIN -- DELETE PRODUCT ==============================
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await imagekit.deleteFolder(
    `${process.env.PRODUCT_PICS_FOLDER}/${product._id}`
  );

  res.status(200).json({
    success: true,
    message: "Product deleted",
  });
});

// ======================= GET ALL TOTAL NUMBER OF PRODUCTS ==============================
exports.getTotalNumberOfProducts = catchAsyncErrors(async (req, res) => {
  const totalProducts = await Product.countDocuments();

  res.status(200).json({
    success: true,
    totalProducts,
  });
});

// ======================= GET ALL PRODUCTS ==============================
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 10;
  const productsCount = await Product.countDocuments();

  let products = new ProductSearchAndFilter(Product, req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  products = await products.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
  });
});

// ======================= GET PRODUCT INFO ==============================
exports.getProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  if (!product.imagesUploaded) {
    return new ErrorHandler("Product not found", 404);
  }

  res.status(200).json({
    success: true,
    product,
  });
});
