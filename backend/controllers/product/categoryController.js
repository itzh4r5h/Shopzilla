const { Category } = require("../../models/product/Category");
const { Product } = require("../../models/product/Product");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { formatJoiErrMessage } = require("../../utils/helpers");
const {
  categoryJoiSchema,
  nameJoiSchema,
  attributesJoiSchema,
  subcategoriesJoiSchema,
} = require("../../validators/product/categoryValidator");
const mongoose = require("mongoose");

// =================== CREATE A WHOLE CATEGORY WITH SUBCATORIES AND THEIR ATTRIBUTES ======================================
exports.createCategory = catchAsyncErrors(async (req, res, next) => {
  const { name, category_icon, subcategories } = req.body;

  const { error } = categoryJoiSchema.validate({
    name,
    category_icon,
    subcategories,
  });

  if (error) {
    return next(new ErrorHandler(formatJoiErrMessage(error), 400));
  }

  await Category.create({ name, category_icon, subcategories });

  res.status(201).json({
    success: true,
    message: "category created",
  });
});

// ============================ UPDATE MAIN CATEGORY NAME ============================================
exports.updateCategoryName = catchAsyncErrors(async (req, res, next) => {
  const { name, icon } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("category not exists", 404));
  }

   const products = await Product.find({
    category: req.params.id,
  });

  if (products.length > 0) {
    return next(
      new ErrorHandler(
        `cann't update name as it is used in ${products.length} products`,
        400
      )
    );
  }

  const { error } = nameJoiSchema.validate({ name, icon });

  if (error) {
    return next(new ErrorHandler(formatJoiErrMessage(error), 400));
  }

  await Category.findByIdAndUpdate(
    req.params.id,
    { name, category_icon: icon },
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "category name updated",
  });
});

// =========================== ADD SUB CATEGORY UNDER SPECIFIED CATEGORY ==================================
exports.addSubCategory = catchAsyncErrors(async (req, res, next) => {
  const { subcategories } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("category not exists", 404));
  }

  const { error } = subcategoriesJoiSchema.validate({ subcategories });

  if (error) {
    return next(new ErrorHandler(formatJoiErrMessage(error), 400));
  }

  category.subcategories = [...category.subcategories, ...subcategories];

  await category.save({ validateBeforeSave: true });

  res.status(201).json({
    success: true,
    message:
      subcategories.length > 1 ? "subcategories added" : "subcategory added",
  });
});

// ============================= UPDATE SUB-CATEGORY NAME ==============================
exports.updateSubCategoryName = catchAsyncErrors(async (req, res, next) => {
  const { name, icon } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("category not exists", 404));
  }

  isSubCategoryExists = category.subcategories.find(
    (subcategory) => subcategory._id.toString() === req.params.subId
  );

  if (!isSubCategoryExists) {
    return next(new ErrorHandler("subcategory not exists", 404));
  }

  const products = await Product.find({
    subcategory: isSubCategoryExists.name,
  });

  if (products.length > 0) {
    return next(
      new ErrorHandler(
        `cann't update name as it is used in ${products.length} products`,
        400
      )
    );
  }

  const { error } = nameJoiSchema.validate({ name, icon });

  if (error) {
    return next(new ErrorHandler(formatJoiErrMessage(error), 400));
  }

  category.subcategories.forEach((subcategory) => {
    if (subcategory._id.toString() === req.params.subId) {
      subcategory.name = name;
      subcategory.subcategory_icon = icon;
    }
  });

  await category.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: "subcategory name updated",
  });
});

// =========================== UPDATE SUB-CATEGORY ATTRIBUTES ===============================
exports.updateSubCategoryAttriubtes = catchAsyncErrors(
  async (req, res, next) => {
    const { attributes } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorHandler("category not exists", 404));
    }

    isSubCategoryExists = category.subcategories.find(
      (subcategory) => subcategory._id.toString() === req.params.subId
    );

    if (!isSubCategoryExists) {
      return next(new ErrorHandler("subcategory not exists", 404));
    }

    const { error } = attributesJoiSchema.validate({ attributes });

    if (error) {
      return next(new ErrorHandler(formatJoiErrMessage(error), 400));
    }

    category.subcategories.forEach((subcategory) => {
      if (subcategory._id.toString() === req.params.subId) {
        subcategory.attributes = attributes;
      }
    });

    await category.save({ validateBeforeSave: true });

    res.status(200).json({
      success: true,
      message: "attributes updated",
      category,
    });
  }
);

// =========================== DELETE SUB-CATEGORY ===============================
exports.deleteSubCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("category not exists", 404));
  }

  isSubCategoryExists = category.subcategories.find(
    (subcategory) => subcategory._id.toString() === req.params.subId
  );

  if (!isSubCategoryExists) {
    return next(new ErrorHandler("subcategory not exists", 404));
  }

  const products = await Product.find({
    subcategory: isSubCategoryExists.name,
  });

  if (products.length > 0) {
    return next(
      new ErrorHandler(
        `cann't delete as it is used in ${products.length} products`,
        400
      )
    );
  }

  if (category.subcategories.length > 1) {
    category.subcategories = category.subcategories.filter(
      (subcategory) => subcategory._id.toString() !== req.params.subId
    );
  } else {
    return next(
      new ErrorHandler("cann't delete instead delete whole category", 400)
    );
  }

  await category.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: "subcategory deleted",
    category,
  });
});

// =========================== DELETE CATEGORY ===============================
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("category not exists", 404));
  }

  const products = await Product.find({ category: req.params.id });

  if (products.length > 0) {
    return next(
      new ErrorHandler(
        `cann't delete as it is used in ${products.length} products`,
        400
      )
    );
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "category deleted",
  });
});

// =========================== GET ALL CATEGORIES ======================
exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.aggregate([
    {
      $project: {
        name: 1,
        icon: "$category_icon", // rename field
      },
    },
  ]);

  res.status(200).json({
    success: true,
    categories,
  });
});

// =========================== GET ALL SUB CATEGORIES ======================
exports.getAllSubCategoriesOfSpecifiedCategory = catchAsyncErrors(
  async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorHandler("category not exists", 404));
    }

    const subcategories = await Category.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      { $unwind: "$subcategories" },
      {
        $project: {
          _id: "$subcategories._id",
          name: "$subcategories.name",
          icon: "$subcategories.subcategory_icon",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      subcategories,
    });
  }
);

// =========================== GET ALL ATTRIBUTES OF SUB CATEGORY ======================
exports.getAllAttributesOfSubCategory = catchAsyncErrors(
  async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorHandler("category not exists", 404));
    }

    isSubCategoryExists = category.subcategories.find(
      (subcategory) => subcategory._id.toString() === req.params.subId
    );

    if (!isSubCategoryExists) {
      return next(new ErrorHandler("subcategory not exists", 404));
    }

    const attributes = await Category.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      { $unwind: "$subcategories" },
      {
        $match: {
          "subcategories._id": new mongoose.Types.ObjectId(req.params.subId),
        },
      },
      {
        $unwind: "$subcategories.attributes",
      },
      {
        $replaceRoot: { newRoot: "$subcategories.attributes" },
      },
    ]);

    res.status(200).json({
      success: true,
      attributes,
    });
  }
);

exports.getAllCategoriesAndSubCategories = catchAsyncErrors(
  async (req, res, next) => {
    const categories = await Category.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          subcategories: {
            $map: {
              input: "$subcategories",
              as: "sub",
              in: {
                _id: "$$sub._id",
                name: "$$sub.name",
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      categories,
    });
  }
);
