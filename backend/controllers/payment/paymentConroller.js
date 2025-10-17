const { Variant } = require("../../models/product/Variant");
const { Order } = require("../../models/Order");
const { Payment } = require("../../models/Payment");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { User } = require("../../models/User");

// Intance of RazorPay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =============================== CEATE PAYMENT ORDER =========================
exports.createPaymentOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.body;

  if (!orderId) {
    return next(new ErrorHandler("order id is required"));
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
exports.verifyPayment = catchAsyncErrors(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart } =
    req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

  if (!payment) {
    return next(new ErrorHandler("razorpay order not exists", 404));
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = "completed";

    await payment.save({ validateBeforeSave: true });

    const order = await Order.findByIdAndUpdate(payment.order, {
      orderStatus: "confirmed",
      confirmed: Date.now(),
      paymentInfo: payment._id,
    });

    order.orderItems.forEach(async (item) => {
      const { colorIndex, sizeIndex, quantity } = item;

      const variant = await Variant.findById(item.variantId);

      let stock;

      if (variant.needSize) {
        stock = variant.images[colorIndex].sizes[sizeIndex].stock - quantity;
        variant.images[colorIndex].sizes[sizeIndex].stock = stock;
      } else {
        stock = variant.images[colorIndex].stock - quantity;
        variant.images[colorIndex].stock = stock;
      }
      await variant.save({ validateBeforeSave: true });
    });

    if (cart) {
      const user = await User.findById(req.user._id).populate({
        path: "cartProducts.variant",
        populate: {
          path: "product",
        },
      });
      
      const outOfStockProducts = user.cartProducts.filter((cartProduct) => {
          const {variant,colorIndex,sizeIndex} = cartProduct
          if(variant.needSize){
            if(variant.images[colorIndex].sizes[sizeIndex].stock === 0){
              return true
            }
            return false
          }else{
             if(variant.images[colorIndex].stock === 0){
              return true
            }
            return false
          }
        }
      );
      user.cartProducts = [...outOfStockProducts];
      await user.save({ validateBeforeSave: true });
    }

    res.status(200).json({
      success: true,
      orderId: order._id,
    });
  } else {
    // TODO:  later change it with redirect // i don't know right now
    res.status(400).json({
      success: false,
      message: "Invalid Signature",
    });
  }
});

exports.getYears = catchAsyncErrors(async (req, res, next) => {
  let years = await Payment.aggregate([
    // Add a new field "year" extracted from createdAt
    {
      $addFields: { year: { $year: "$createdAt" } },
    },

    //Group by year (this ensures uniqueness)
    { $group: { _id: "$year" } },

    //reshape output
    { $project: { _id: 0, year: "$_id" } },

    //sort ascending
    { $sort: { year: -1 } },
  ]);

  years = years.map((doc) => doc.year);

  res.status(200).json({
    success: true,
    years,
  });
});

exports.getTotalRevenue = catchAsyncErrors(async (req, res, next) => {
  const { year } = req.params;

  const payments = await Payment.aggregate([
    // Get only completed payments
    {
      $match: { status: "completed" },
    },

    // Add a new field "year" extracted from createdAt
    {
      $addFields: { year: { $year: "$createdAt" } },
    },

    // 3️⃣ Filter by the given year
    {
      $match: { year: Number(year) },
    },

    // Remove helper field if you don’t want it in output
    {
      $project: { _id: 0, amount: 1 },
    },
  ]);

  let totalRevenue = 0;

  payments.forEach((payment) => {
    const amt = payment.amount / 100; //for converting into rupees as it in paise
    totalRevenue += amt;
  });

  res.status(200).json({
    success: true,
    totalRevenue,
  });
});

exports.getMonthlyRevenueByYear = catchAsyncErrors(async (req, res, next) => {
  const { year } = req.params;

  const results = await Payment.aggregate([
    // Get only completed payments
    {
      $match: { status: "completed" },
    },

    // Add a new field "year" extracted from createdAt
    {
      $addFields: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      },
    },

    // 3️⃣ Filter by the given year
    {
      $match: { year: Number(year) },
    },

    // Group by month, sum all amounts
    {
      $group: {
        _id: "$month",
        totalAmount: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Month names
  const monthNames = [
    "",
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  // Fill missing months with 0 totalAmount
  const monthlyRevenue = {};
  Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    const match = results.find((r) => r._id === monthNum);
    // divide by 100 so that amt converts to rs. as it is in paise
    monthlyRevenue[monthNames[monthNum]] = match ? match.totalAmount / 100 : 0;
  });

  res.status(200).json({
    success: true,
    monthlyRevenue,
  });
});
