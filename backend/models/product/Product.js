const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [2, "name should be at least 2 characters long"],
      maxLength: [30, "name can not exceed 30 characters"],
      trim: true,
      index: "text",
    },

    description: {
      type: String,
      required: [true, "description is required"],
      minLength: [10, "description should be at least 10 characters long"],
      maxLength: [10000, "description is too long"],
      trim: true,
    },

    brand: {
      type: String,
      required: [true, "brand is required"],
      trim: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "category is required"],
      index: true,
    },

    subcategory: {
      type: String,
      required: [true, "sub-category is required"],
      index: true,
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
  },
  { timestamps: true }
);

productSchema.index({ category: 1, subcategory: 1, brand: 1 });


const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
