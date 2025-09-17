import Joi from "joi";

const maxImages = Number(import.meta.env.VITE_PRODUCT_MAX_IMAGES);
const MAX_SIZE_MB = Number(import.meta.env.VITE_IMAGE_MAX_SIZE_IN_MB);
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export const productJoiSchema = (edit) => {
  const baseSchema = {
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
  };

  if (!edit) {
    baseSchema.category = Joi.string().min(2).max(50).required().messages({
      "string.base": "category must be a string",
      "string.empty": "category is required",
      "string.min": "category must be at least 2 characters long",
      "string.max": "category must not exceed 50 characters",
      "any.required": "category is required",
    });

    baseSchema.subcategory = Joi.string().min(2).max(50).required().messages({
      "string.base": "subcategory must be a string",
      "string.empty": "subcategory is required",
      "string.min": "subcategory must be at least 2 characters long",
      "string.max": "subcategory must not exceed 50 characters",
      "any.required": "subcategory is required",
    });
  }
  return Joi.object(baseSchema);
};

const filesJoiSchema = Joi.object({
  color: Joi.string().min(3).max(10).required().messages({
    "string.base": "color must be a string",
    "string.empty": "color is required",
    "string.min": "color must be at least 3 characters long",
    "string.max": "color must not exceed 10 characters",
    "any.required": "color is required",
  }),
  files: Joi.array()
    .items(
      Joi.custom((file, helpers) => {
        if (file.url) {
          return file;
        }
        const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
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
    .try(
      Joi.string().messages({
        "string.empty": "attribute value is required",
      }),
      Joi.array()
        .items(
          Joi.object({
            value: Joi.string().trim().min(1).max(5),
          })
        )
        .min(1)
        .max(50)
        .messages({
          "array.empty": "option value is required",
          "array.min": "at least one option is required",
          "array.max": "options cann't be more than 50",
        })
    )
    .required()
    .messages({
      "any.required": "attribute value is required",
      "alternatives.match": "attribute value must be a valid type",
    }),
});

export const variantJoiSchema = Joi.object({
  price: Joi.number().min(0).greater(0).required().messages({
    "number.base": "price must be a number",
    "number.min": "price cannot be negative",
    "number.greater": "price cannot be 0",
    "any.required": "price is required",
  }),

  stock: Joi.number().min(0).greater(0).messages({
    "number.base": "stock must be a number",
    "number.min": "stock cannot be negative",
    "number.greater": "stock cannot be 0",
  }),
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
  images: Joi.array().items(filesJoiSchema).min(1).required().messages({
    "array.base": "images must be an array",
    "any.required": "images are required",
    "array.min": "at least one image is required",
    "object.base": "each images must be an object with valid fields",
  }),
});
