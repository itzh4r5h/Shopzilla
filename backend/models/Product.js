const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minLength: [2, "name should be at least 2 characters long"],
    maxLength: [30, "name can not exceed 30 characters"],
    trim: true,
  },

  description: {
    type: String,
    required: [true, "description is required"],
    minLength: [10, "description should be at least 10 characters long"],
    maxLength: [10000, "description is too long"],
    trim: true,
  },

  price: {
    type: Number,
    required: [true, "price is required"],
    min: 0,
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },

  brand: {
    type: String,
    required: [true, "brand is required"],
    trim: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "category is required"],
  },

  attributes: { type: Map, of: mongoose.Schema.Types.Mixed }, // flexible key-value pairs

  images: [
    {
      url: {
        type: String,
        required: [true, "image url is required"],
      },
      fileId: {
        type: String,
        required: [true, "image file-id is required"],
      },
      name: {
        type: String,
        required: [true, "image name is required"],
      },
    },
  ],

  imagesUploaded: {
    type: Boolean,
    default: false,
  },

  ratings: {
    type: Number,
    default: 0,
    min: [0, "rating cannot be less than 0"],
    max: [5, "rating cannot exceed 5"],
  },

  reviewsCount: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: {
        type: String,
        required: [true, "user name is required"],
      },
      rating: {
        type: Number,
        min: [0, "rating cannot be less than 0"],
        max: [5, "rating cannot exceed 5"],
        required: [true, "rating is required"],
      },
      comment: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
