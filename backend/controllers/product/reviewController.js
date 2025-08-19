const { Product } = require("../../models/product/Product");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { isOnlyDigits } = require("../../utils/helpers");
const { Order } = require("../../models/Order");

// ======================= CREATE OR UPDATE PRODUCT REVIEW ==============================
exports.createOrUpdateProductReview = catchAsyncErrors(
  async (req, res, next) => {
    const { rating, comment } = req.body;

    if (!rating) {
      return next(new ErrorHandler("rating is required", 400));
    }

    if(comment && typeof comment !== 'string'){
        return next(new ErrorHandler('comment must be string'))
    }

    if (!isOnlyDigits(rating)) {
      return next(new ErrorHandler("rating must be a number", 400));
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("product not exists", 404));
    }

    let review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const isReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user._id.toString()) {
          review.rating = rating;
          review.comment = comment;
        }
      });
    } else {
      const commentsCount = product.reviews.filter((review)=>review.comment !== '').length
      product.reviews.push(review);
      product.reviewsCount = commentsCount
    }

    // sum up all the ratings of product
    let totalRatings = 0;
    product.reviews.forEach((review) => {
      totalRatings += review.rating;
    });

    // overall rating of product
    product.ratings = totalRatings / product.reviews.length;

    await product.save({ validateBeforeSave: true });
    res.status(200).json({
      success: true,
      message: isReviewed?"review updated":"product reviewed",
    });
  }
);

// ======================= GET ALL REVIEWS OF A PRODUCT ==============================
exports.getAllReviewsAndRatingsOfAProduct = catchAsyncErrors(
  async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("product not exists", 404));
    }

    const allRatings = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let totalRatings = 0

    product.reviews.forEach((review) => {
      allRatings[review.rating] = allRatings[review.rating] + 1;
      totalRatings += allRatings[review.rating]
    });

    res.status(200).json({
      success: true,
      reviews: product.reviews,
      reviewsCount: product.reviewsCount,
      allRatings,
      totalRatings
    });
  }
);

// ======================= DELETE PRODUCT REVIEW ==============================
exports.deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not exists", 404));
  }

  const isReviewExists = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString().toString()
  );

  if (!isReviewExists) {
    return next(new ErrorHandler("review not exists", 404));
  }

  const reviews = product.reviews.filter(
    (review) => review.user.toString() !== req.user._id.toString().toString()
  );

  // sum up all the ratings of product
  let totalRatings = 0;

  reviews.forEach((review) => {
    totalRatings += review.rating;
  });

  const reviewsCount = reviews.filter((review)=>review.comment !== '').length
  const ratingsCount = reviews.length || 1

  // overall rating of product
  const ratings = totalRatings / ratingsCount;

  await Product.findByIdAndUpdate(
    req.params.id,
    { ratings, reviews, reviewsCount },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "review deleted",
  });
});
