const { Product } = require("../../models/Product");
const { Order } = require("../../models/Order");
const { Payment } = require("../../models/Payment");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const Razorpay = require("razorpay");
const crypto = require('crypto');
const { User } = require("../../models/User");

// Intance of RazorPay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =============================== CEATE PAYMENT ORDER =========================
exports.createPaymentOrder = catchAsyncErrors(async (req, res, next) => {
  const {orderId} = req.body

  if(!orderId){
    return next(new ErrorHandler('order id is required'))
  }

  const order = await Order.findById(orderId);

  if (!order) {
    return next(new ErrorHandler("order not exists", 404));
  }


  const options = {
    amount: order.totalPrice * 100, // amount in smallest currency unit
    currency: "INR",
  };

  const razorpayOrder = await razorpay.orders.create(options);

  await Payment.create({
    user: req.user._id,
    order: order._id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  });

  res.status(201).json({
    success: true,
    razorpayOrder,
  });
});


// =============================== VERIFY PAYMENT  =========================
exports.verifyPayment = catchAsyncErrors(async(req,res,next)=>{
   const { razorpay_order_id, razorpay_payment_id, razorpay_signature,cart } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET
    const body = `${razorpay_order_id}|${razorpay_payment_id}`

    const payment = await Payment.findOne({razorpayOrderId:razorpay_order_id})
       
    if(!payment){
    return next(new ErrorHandler('razorpay order not exists',404))
    }

    const expectedSignature = crypto.createHmac('sha256',secret).update(body.toString()).digest('hex')

    if(expectedSignature === razorpay_signature){
       
       payment.razorpayPaymentId = razorpay_payment_id
       payment.signature = razorpay_signature
       payment.status = 'completed'

       await payment.save({validateBeforeSave:true})
       
      const order = await Order.findByIdAndUpdate(payment.order,{orderStatus:'confirmed',confirmed:Date.now(),paymentInfo:payment._id})

      order.orderItems.forEach(async(item)=>{
        const product = await Product.findById(item.product)
        const stock = product.stock - item.quantity
        product.stock = stock
        await product.save({validateBeforeSave:true})
      })

     if(cart){
       await User.findByIdAndUpdate(req.user._id,{cartProducts:[]},{new:true,runValidators:true})
     }

      res.status(200).json({
        success:true,
        orderId: order._id
      })
    }
    else{
      // TODO:  later change it with redirect // i don't know right now
       res.status(400).json({
         success: false,
         message: 'Invalid Signature'
       })
    }

})