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
  value: Joi.alternatives()
    .try(Joi.string(), Joi.number(), Joi.boolean(), Joi.array())
    .required()
    .messages({
      "any.required": "attribute value is required",
      "alternatives.match": "attribute value must be a valid type",
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

  price: Joi.number().min(0).required().messages({
    "number.base": "price must be a number",
    "number.min": "price cannot be negative",
    "any.required": "price is required",
  }),

  stock: Joi.number().min(0).default(0).messages({
    "number.base": "stock must be a number",
    "number.min": "stock cannot be negative",
  }),

  sku: Joi.string().trim().required().messages({
    "string.base": "sku must be a string",
     "any.required": "sku is required",
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

// const imagesJoiSchema = Joi.array()
//       .items(
//         Joi.custom((file, helpers) => {
//           const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
//           if (!allowedTypes.includes(file.mimetype)) {
//             return helpers.error("file.type");
//           }

//           if (file.size > MAX_SIZE_BYTES) {
//             return helpers.error("file.size");
//           }

//           return file; // valid
//         })
//       )
//       .min(1)
//       .max(maxImages)
//       .required()
//       .messages({
//         "array.base": "images must be in an array format",
//         "array.min": "please upload at least one image",
//         "array.max": `you can upload a maximum of ${maxImages} images`,
//         "file.type": "only PNG or JPEG files are allowed",
//         "file.size": `image size must not exceed ${MAX_SIZE_MB}MB`,
//       })

module.exports = { variantJoiSchema, productJoiSchema };
