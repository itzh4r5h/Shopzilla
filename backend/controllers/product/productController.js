const {joiValidator,Product} = require('../../models/Product')
const ErrorHandler = require('../../utils/errorHandler')
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors')
const ApiFeatures = require('../../utils/apiFeatures')
const { isOnlyDigits } = require('../../utils/helpers')

// ======================= ADMIN -- CREATE PRODUCT ==============================
exports.createProduct = catchAsyncErrors(async (req,res,next)=>{
    const error = joiValidator(req.body)
    if(error){
        let msg = error.message.replaceAll('"','')
        return next(new ErrorHandler(msg,400))
    }

    req.body.user = req.user._id

    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})


// ======================= ADMIN -- UPDATE PRODUCT ==============================
exports.updateProduct = catchAsyncErrors(async (req,res,next)=>{

    const product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

    if(!product){
       return next(new ErrorHandler('Product not found',404))
    }

    res.status(200).json({
        success: true,
        product
    })
})


// ======================= ADMIN -- DELETE PRODUCT ==============================
exports.deleteProduct = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findByIdAndDelete(req.params.id)

    if(!product){
       return next(new ErrorHandler('Product not found',404))
    }

    res.status(200).json({
        success: true,
        message: 'Product deleted'
    })
})


// ======================= GET ALL PRODUCTS ==============================
exports.getAllProducts = catchAsyncErrors(async (req,res)=>{
    const resultPerPage = 10
    const productsCount = await Product.countDocuments()

    const apiFeatures = new ApiFeatures(Product, req.query).search().filter().pagination(resultPerPage)

    const products = await apiFeatures.query

    res.status(200).json({
        success: true, 
        products,
        productsCount
    })
})


// ======================= GET PRODUCT INFO ==============================
exports.getProduct = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }

    res.status(200).json({
        success: true,
        product
    })
})


