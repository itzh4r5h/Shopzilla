const Joi = require("joi");

const maxImages = Number(process.env.PRODUCT_MAX_IMAGES);
const MAX_SIZE_MB = Number(process.env.IMAGE_MAX_SIZE_IN_MB);
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// Attribute schema for each variant
const productAttributeJoiSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.base": "attribute name must be a string",
    "string.empty": "attribute name is required",
    "string.min": "attribute name must be at least 2 characters long",
    "string.max": "attribute name must not exceed 50 characters",
    "any.required": "attribute name is required",
  }),
  value: Joi.alternatives().try(Joi.string(), Joi.array()).required().messages({
    "any.required": "attribute value is required",
    "alternatives.match": "attribute value must be a valid type",
  }),
});

const filesJoiSchema = Joi.object({
  color: Joi.string().min(3).max(10).required().messages({
    "string.base": "color must be a string",
    "string.empty": "color is required",
    "string.min": "color must be at least 3 characters long",
    "string.max": "color must not exceed 10 characters",
    "any.required": "color is required",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "price must be a number",
    "number.min": "price cannot be negative",
    "any.required": "price is required",
  }),

  stock: Joi.number()
    .min(1)
    .greater(0)
    .when(Joi.ref("....needSize"), {
      is: false, // if needSize = false
      then: Joi.required().messages({
        "number.base": "stock must be a number",
        "number.min": "stock cannot be 0",
        "number.greater": "stock cannot be 0",
      }),
      otherwise: Joi.forbidden(), // prevent stock if not needed
    }),

  sizes: Joi.array()
    .items(
      Joi.object({
        size: Joi.string().min(1).max(5).required().messages({
          "any.required": "size is required",
          "string.empty": "size is required",
          "string.min": "size cann't be empty",
          "string.max": "size cann't exceed 5 chars",
        }),
        stock: Joi.number().min(1).greater(0).required().messages({
          "number.base": "stock must be a number",
          "number.min": "stock cannot be 0",
          "number.greater": "stock cannot be 0",
        }),
      })
    )
    .when(Joi.ref("....needSize"), {
      is: true, // if needSize = true
      then: Joi.required().messages({ "any.required": "sizes are required" }),
      otherwise: Joi.forbidden(), // prevent sizes[] if not needed
    }),

  files: Joi.array()
    .items(
      Joi.custom((file, helpers) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
        if (file.url) {
          return file;
        }

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
      "file.type": "Only PNG or JPEG or WEBP files are allowed",
      "file.size": `File size must not exceed ${MAX_SIZE_MB}MB`,
    }),
});

// Variant schema
const variantJoiSchema = Joi.object({
  attributes: Joi.array()
    .items(productAttributeJoiSchema)
    .min(1)
    .required()
    .messages({
      "array.base": "attributes must be an array",
      "any.required": "attributes are required",
      "array.min": "at least one attribute is required",
      "object.base": "each attribute must be an object with valid fields",
    }),
});

const imagesJoiSchema = Joi.object({
  needSize: Joi.boolean().required(),
  images: Joi.array().items(filesJoiSchema).min(1).required().messages({
    "array.base": "images must be an array",
    "any.required": "images are required",
    "array.min": "at least one image is required",
    "object.base": "each images must be an object with valid fields",
  }),
});

const productJoiSchema = Joi.object({
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

  brand: Joi.string().min(2).max(50).trim().required().messages({
    "string.base": "brand must be a string",
    "string.empty": "brand is required",
    "string.min": "brand must be at least {#limit} characters long",
    "string.max": "brand cannot be more than {#limit} characters",
    "any.required": "brand is required",
  }),

  subcategory: Joi.string().min(2).max(50).required().messages({
    "string.base": "subcategory must be a string",
    "string.empty": "subcategory is required",
    "string.min": "subcategory must be at least 2 characters long",
    "string.max": "subcategory must not exceed 50 characters",
    "any.required": "subcategory is required",
  }),
});

const baseProductJoiSchema = Joi.object({
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

  brand: Joi.string().min(2).max(50).trim().required().messages({
    "string.base": "brand must be a string",
    "string.empty": "brand is required",
    "string.min": "brand must be at least {#limit} characters long",
    "string.max": "brand cannot be more than {#limit} characters",
    "any.required": "brand is required",
  }),
});

module.exports = {
  variantJoiSchema,
  productJoiSchema,
  baseProductJoiSchema,
  imagesJoiSchema,
};
