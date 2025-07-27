const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const { User } = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken')

exports.isUserAuthenticated = catchAsyncErrors(async (req,res,next)=>{
    const {token} = req.cookies;
    
    if(!token){
        return next(new ErrorHandler('User not authorized, please signin',401))
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET)

    if(!decodedData){
        return next(new ErrorHandler('token is invalid',401))
    }

    const user = await User.findById(decodedData.id)

    if(!user){
        return next(new ErrorHandler('User not exists',404))
    }

    req.user = user

    next()
})

exports.authorizedRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role "${req.user.role}" is not authorized`,403))
        }
        next()
    }
}


exports.isOtpValid = catchAsyncErrors(async (req,res,next)=>{
    const {otp} = req.body

    if(!otp || otp.toString().trim() === ''){
        return next(new ErrorHandler('OTP is required',400))
    }
    const user = await User.findOne({otp,otpExpire:{$gt:Date.now()}})

    if(!user){
        return next(new ErrorHandler('Invalid OTP or OTP is expired',404))
    }
    
    user.otp = undefined
    user.otpExpire = undefined
    await user.save({validateBeforeSave:false})

    next()
})

exports.isEmailVerified = catchAsyncErrors(async (req,res,next)=>{
    const { email } = req.body

    if(!email || email.toString().trim() === ''){
        return next(new ErrorHandler('email is required',400))
    }
    const user = await User.findOne({email})

    if(!user){
        return next(new ErrorHandler('user not exists',404))
    }
    
    if(!user.isVerified){
        return next(new ErrorHandler('Account no longer exists',410))
    }

    next()
})