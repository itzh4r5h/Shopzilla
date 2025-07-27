const {Product} = require('../../models/Product')
const ErrorHandler = require('../../utils/errorHandler')
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors')
const { isOnlyDigits } = require('../../utils/helpers')

// ======================= CREATE OR UPDATE PRODUCT REVIEW ==============================
exports.createOrUpdateProductReview = catchAsyncErrors(async (req,res,next)=>{
    const {rating,comment} = req.body


    if(!rating || !comment || comment.toString().trim()===''){
        return next(new ErrorHandler('rating and comment are required',400))
    }

    if(!isOnlyDigits(rating)){
        return next(new ErrorHandler('rating must be a number',400))
    }

    const product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler('product not exists',404))
    }

    
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const isReviewed = product.reviews.find(review=>review.user.toString() === req.user._id.toString())


    if(isReviewed){
        product.reviews.forEach((review)=>{
            if(review.user.toString() === req.user._id.toString()){
                review.rating = rating
                review.comment = comment
            }
        })
    }else{
        product.reviews.push(review)
        product.reviewsCount = product.reviews.length
    }

    // sum up all the ratings of product
    let totalRatings = 0
    product.reviews.forEach(review=>{
        totalRatings+=review.rating
    })

    // overall rating of product
    product.ratings = totalRatings / product.reviews.length

    await product.save({validateBeforeSave: true})
    res.status(200).json({
        success: true,
        message: 'product reviewed'
    })
})



// ======================= GET ALL REVIEWS OF A PRODUCT ==============================
exports.getAllReviewsOfAProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler('product not exists',404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
        reviewsCount: product.reviewsCount
    })
})


// ======================= DELETE PRODUCT REVIEW ==============================
exports.deleteProductReview = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.productId)

    if(!product){
        return next(new ErrorHandler('product not exists',404))
    }

    const isReviewExists = product.reviews.find((review)=>review._id.toString() === req.params.reviewId.toString())

    if(!isReviewExists){
        return next(new ErrorHandler('review not exists',404))
    }

    const reviews = product.reviews.filter((review)=>review._id.toString() !== req.params.reviewId.toString())

   // sum up all the ratings of product
    let totalRatings = 0

    reviews.forEach(review=>{
        totalRatings+=review.rating
    })

    const reviewsCount = reviews.length
  
    // overall rating of product
    const ratings = totalRatings === 0 && reviewsCount === 0 ? 0 : totalRatings / reviewsCount

    await Product.findByIdAndUpdate(req.params.productId,{ratings,reviews,reviewsCount},{new:true,runValidators:true})

    res.status(200).json({
        success: true,
        message: 'review deleted'
    })
})