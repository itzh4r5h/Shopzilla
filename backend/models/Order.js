const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingAddress: {
    address: {
      type: String,
      trim: true,
      maxLength: [255, "address cannot exceed 255 characters"],
      required: [true, "address is required"],
    },
    city: {
      type: String,
      trim: true,
      required: [true, "city is required"],
      maxLength: [85, "city cannot exceed 85 characters"],
    },
    state: {
      type: String,
      trim: true,
      required: [true, "state is required"],
      maxLength: [85, "state cannot exceed 85 characters"],
    },
    country: {
      type: String,
      trim: true,
      required: [true, "country is required"],
      maxLength: [85, "country cannot exceed 85 characters"],
    },
    pinCode: {
      type: Number,
      required: [true, "pin-code is required"],
    },
    mobileNumber: {
      type: Number,
      required: [true, "mobile number is required"],
    },
  },

  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  paymentInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },

  itemsPrice: {
    type: Number,
    default: 0,
    required: true,
  },

  shippingPrice: {
    type: Number,
    default: 0,
    required: true,
  },

  totalPrice: {
    type: Number,
    default: 0,
    required: true,
  },

  orderStatus: {
    type: String,
    required: true,
    default: "pending",
    enum: [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "dispatched",
      "out for delivery",
      "delivered",
    ],
  },

  deliveredAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Order = mongoose.model("Order",orderSchema)

module.exports = {Order}
