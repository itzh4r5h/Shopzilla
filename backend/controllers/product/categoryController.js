const { Category } = require("../../models/product/Category");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { formatJoiErrMessage } = require("../../utils/helpers");
const {
  categoryJoiSchema,
  nameJoiSchema,
  subcategoryJoiSchema,
} = require("../../validators/product/categoryValidator");

// =================== CREATE A WHOLE CATEGORY WITH SUBCATORIES AND THEIR ATTRIBUTES ======================================
exports.createCategory = catchAsyncErrors(async (req, res, next) => {
  const { name, subcategories } = req.body;

  const { error } = categoryJoiSchema.validate({ name, subcategories });

  if (error) {
    return next(new ErrorHandler(formatJoiErrMessage(error), 400));
  }

  const category = await Category.create({ name, subcategories });

  res.status(201).json({
    success: true,
    message: "category created",
    category,
  });
});

// ============================ UPDATE MAIN CATEGORY NAME ============================================
exports.updateCategoryName = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  const { error } = nameJoiSchema.validate(name);

  if (error) {
    return next(new ErrorHandler(formatJoiErrMessage(error), 400));
  }

  const category = await Category.findByIdAndUpdate(req.params.id, name, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    success: true,
    message: "category name updated",
    category,
  });
});

// =========================== ADD SUB CATEGORY UNDER SPECIFIED CATEGORY ==================================
exports.addSubCategory = catchAsyncErrors(async (req, res, next) => {
  const { name, attributes } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("category not exists", 404));
  }

  const { error } = subcategoryJoiSchema.validate({ name, attributes });

  if (error) {
    return next(new ErrorHandler(formatJoiErrMessage(error), 400));
  }

  const subcategory = { name, attributes };

  category.subcategories = [...category.subcategories, subcategory];

  await category.save({ validateBeforeSave: true });

  res.status(201).json({
    success: true,
    message: "subcategory added",
    category,
  });
});

// ============================= UPDATE SUB-CATEGORY NAME ==============================
exports.updateSubCategoryName = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

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

  const { error } = nameJoiSchema.validate(name);

  if (error) {
    return next(new ErrorHandler(formatJoiErrMessage(error), 400));
  }

  category.subcategories.forEach((subcategory) => {
    if (subcategory._id.toString() === req.params.subId) {
      subcategory.name = name;
    }
  });

  await category.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: "subcategory name updated",
    category,
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

    const { error } = subcategoryJoiSchema.validate({
      name: isSubCategoryExists.name,
      attributes,
    });

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

  if(category.subcategories.length > 1){
      category.subcategories = category.subcategories.filter(
        (subcategory) => subcategory._id.toString() !== req.params.subId
      );
  }else{
    return next(new ErrorHandler("cann't delete instead delete whole category",400))
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

  await Category.findByIdAndDelete(req.params.id)

  res.status(200).json({
    success: true,
    message: "category deleted",
  });
});
