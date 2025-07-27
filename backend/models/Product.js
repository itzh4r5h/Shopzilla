const mongoose = require("mongoose");
const Joi = require("joi");

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

  category: {
    type: String,
    required: [true, "category is required"],
    trim: true,
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },

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
        required: [true, "comment is required"],
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

const joiValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).trim().required(),
    description: Joi.string().min(10).max(10000).trim().required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().trim().required(),
    stock: Joi.number().min(0),
    images: Joi.array().items({
      url: Joi.string().required().messages({
      'string.empty': 'Image URL is required',
      'any.required': 'Image URL is required',
    }),
    fileId: Joi.string().required().messages({
       'string.empty': 'Image fileId is required',
      'any.required': 'Image fileId is required',
    }),
    name: Joi.string().required().messages({
       'string.empty': 'Image name is required',
      'any.required': 'Image name is required',
    })
    }),
    ratings: Joi.number().min(0).max(5),
    reviewsCount: Joi.number(),
    reviews: Joi.array().items({
      user: Joi.string().required(),
      name: Joi.string().required(),
      rating: Joi.number().min(0).max(5).required(),
      comment: Joi.string().required(),
    }),
  });

  const { error } = schema.validate(data);
  return error;
};

const Product = mongoose.model("Product", productSchema);

module.exports = { joiValidator, Product };
