const Joi = require("joi");

const maxImages = Number(process.env.PRODUCT_MAX_IMAGES);
const MAX_SIZE_MB = Number(process.env.IMAGE_MAX_SIZE_IN_MB);
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

exports.joiValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).trim().required().messages({
      "string.base": "Product name must be a string",
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least {#limit} characters long",
      "string.max": "Product name cannot be more than {#limit} characters",
      "any.required": "Product name is required",
    }),

    description: Joi.string().min(10).max(10000).trim().required().messages({
      "string.base": "Description must be a string",
      "string.empty": "Description is required",
      "string.min": "Description must be at least {#limit} characters long",
      "string.max": "Description cannot be more than {#limit} characters",
      "any.required": "Description is required",
    }),

    price: Joi.number().min(0).required().messages({
      "number.base": "Price must be a number",
      "number.min": "Price cannot be negative",
      "any.required": "Price is required",
    }),

    category: Joi.string().trim().required().messages({
      "string.base": "Category must be a string",
      "string.empty": "Category is required",
      "any.required": "Category is required",
    }),

    stock: Joi.number().min(0).messages({
      "number.base": "Stock must be a number",
      "number.min": "Stock cannot be negative",
    }),

    images: Joi.array()
      .items(
        Joi.custom((file, helpers) => {
          const allowedTypes = ["image/png", "image/jpeg","image/webp"];
          if (!allowedTypes.includes(file.mimetype)) {
            return helpers.error("file.type");
          }

          if (file.size > MAX_SIZE_BYTES) {
            return helpers.error("file.size");
          }

          return file; // valid
        })
      )
      .min(1)
      .max(maxImages)
      .required()
      .messages({
        "array.base": "Images must be in an array format",
        "array.min": "Please upload at least one image",
        "array.max": `You can upload a maximum of ${maxImages} images`,
        "file.type": "Only PNG or JPEG files are allowed",
        "file.size": `File size must not exceed ${MAX_SIZE_MB}MB`,
      }),
  });

  const { error } = schema.validate(data);
  return error;
};


exports.joiReviewValidator = (data) => {
  const schema = Joi.object({
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
