const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },

  razorpayOrderId: {
    type: String,
    required: true,
  },

  razorpayPaymentId: {
    type: String,
  },

  razorpaySignature: {
    type: String,
  },

  amount: {
    type: Number,
    required: true,
  },

  currency: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },

  paidAt: {
    type: Date,
  },

  createdAt:{
    type: Date,
    default: Date.now
  }
},{timestamps:true});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = { Payment };
