const Joi = require("joi");

const maxImages = Number(process.env.PRODUCT_MAX_IMAGES);
const MAX_SIZE_MB = Number(process.env.IMAGE_MAX_SIZE_IN_MB);
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

exports.joiProductBaseValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).trim().required().messages({
      "string.base": "name must be a string",
      "string.empty": "name is required",
      "string.min": "name must be at least {#limit} characters long",
      "string.max": "name cannot be more than {#limit} characters",
      "any.required": "name is required",
    }),

    description: Joi.string().min(10).max(10000).trim().required().messages({
      "string.base": "description must be a string",
      "string.empty": "description is required",
      "string.min": "description must be at least {#limit} characters long",
      "string.max": "description cannot be more than {#limit} characters",
      "any.required": "description is required",
    }),

    price: Joi.number().min(0).required().messages({
      "number.base": "price must be a number",
      "number.min": "price cannot be negative",
      "any.required": "price is required",
    }),

    brand: Joi.string().min(2).max(50).trim().required().messages({
      "string.base": "brand must be a string",
      "string.empty": "brand is required",
      "string.min": "brand must be at least {#limit} characters long",
      "string.max": "brand cannot be more than {#limit} characters",
      "any.required": "brand is required",
    }),

    category: Joi.string().trim().required().messages({
      "string.base": "category must be a string",
      "string.empty": "category is required",
      "any.required": "category is required",
    }),

    stock: Joi.number().min(0).messages({
      "number.base": "stock must be a number",
      "number.min": "stock cannot be negative",
    }),

    images: Joi.array()
      .items(
        Joi.custom((file, helpers) => {
          const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
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
        "array.base": "images must be in an array format",
        "array.min": "please upload at least one image",
        "array.max": `you can upload a maximum of ${maxImages} images`,
        "file.type": "only PNG or JPEG files are allowed",
        "file.size": `image size must not exceed ${MAX_SIZE_MB}MB`,
      }),
  });

  const { error } = schema.validate(data);
  return error;
};



