const { Product } = require("../../models/product/Product");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { formatJoiErrMessage } = require("../../utils/helpers");
const { Category } = require("../../models/product/Category");
const {
  productJoiSchema,
  baseProductJoiSchema,
} = require("../../validators/product/variantValidator");
const mongoose = require("mongoose");
const { Variant } = require("../../models/product/Variant");
const { imagekit } = require("../../utils/uploadImages");

// ======================= ADMIN -- CREATE PRODUCT ==============================
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const { category: categoryId, subcategory, ...data } = req.body;

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(new ErrorHandler("category not exists"));
  }

  isSubCategoryExists = category.subcategories.find(
    (subcat) => subcat.name === subcategory
  );

  if (!isSubCategoryExists) {
    return next(new ErrorHandler("subcategory not exists", 404));
  }

  const { error } = productJoiSchema.validate({ ...data, subcategory });

  if (error) {
    return next(new ErrorHandler(formatJoiErrMessage(error), 400));
  }

  if (req.params.id) {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("product not exists", 404));
    }

    await Product.findByIdAndUpdate(product._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "product updated",
    });
  } else {
    data.user = req.user._id;

    await Product.create({
      ...data,
      category: categoryId,
      subcategory,
    });

    res.status(201).json({
      success: true,
      message: "product created",
    });
  }
});

// ======================= ADMIN -- UPDATE PRODUCT ==============================
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not exists", 404));
  }

  const { error } = baseProductJoiSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(formatJoiErrMessage(error), 400));
  }

  await Product.findByIdAndUpdate(product._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "product updated",
  });
});

// ======================= ADMIN -- DELETE PRODUCT ==============================
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not exists", 404));
  }

  const variant = await Variant.findOne({ product: req.params.id });

  await imagekit.deleteFolder(
    `${process.env.PRODUCT_PICS_FOLDER}/${req.params.id}`
  );

  if (variant) {
    await Variant.deleteMany({ product: req.params.id });
  }

  res.status(200).json({
    success: true,
    message: "product deleted",
  });
});

// ======================= ADMIN GET PRODUCT INFO ==============================
exports.getProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .select("-reviews")
    .populate("category");

  if (!product) {
    return next(new ErrorHandler("product not exists", 404));
  }

  const attributes = product.category.subcategories.find(
    (subcat) =>
      subcat.name.toLocaleLowerCase() ===
      product.subcategory.toLocaleLowerCase()
  ).attributes;

  const needSize = product.category.subcategories.find(
    (subcat) =>
      subcat.name.toLocaleLowerCase() ===
      product.subcategory.toLocaleLowerCase()
  ).needSize;

  res.status(200).json({
    success: true,
    product,
    needSize,
    attributes,
  });
});

// ======================= ADMIN GET ALL PRODUCTS ==============================
exports.getAllProduct = catchAsyncErrors(async (req, res, next) => {
  const { keyword, brand, ratings } = req.query;

  const page = req.query.page || 1;
  const limit = 10;

  const category = req.query.category ? JSON.parse(req.query.category) : false;

  const pipeline = [
    // Search by product name
    {
      $match: {
        name: { $regex: keyword, $options: "i" },
      },
    },

    // Apply filters only if they exist
    {
      $match: {
        ...(brand && { brand }),
        ...(ratings && { ratings: { $gte: Number(ratings) } }),
        ...(category?._id && { category: new mongoose.Types.ObjectId(category._id) }),
        ...(category?.subcategory && { subcategory: category.subcategory }),
      },
    },

    // lookup to get category name
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },

    // Pagination + total count together
    {
      $facet: {
        metadata: [{ $count: "total" }],
        products: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              name: 1,
              category: "$categoryInfo.name",
              subcategory: 1,
            },
          },
        ],
      },
    },

    // Reshape output
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
        products: "$products",
      },
    },
  ];

  // Run aggregation
  const result = await Product.aggregate(pipeline);

  res.status(200).json({
    success: true,
    totalPages: result[0]?.totalPages || 0,
    products: result[0]?.products || [],
  });
});

// ======================= ADMIN GET ALL BRANDS ==============================
exports.getAllBrands = catchAsyncErrors(async (req, res, next) => {
  const result = await Product.aggregate([
    {
      $group: {
        _id: "$brand", // group by brand to get unique values
      },
    },
    {
      $project: {
        _id: 0,
        brand: "$_id",
      },
    },
    {
      $sort: { brand: 1 }, // optional: sort alphabetically
    },
  ]);

  const brands = result.map((item) => item.brand);

  res.status(200).json({
    success: true,
    brands,
  });
});
