const Joi = require("joi");

// Attribute Joi Schema
const attributeDefinitionJoiSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.base": "attribute name must be a string",
    "string.empty": "attribute name is required",
    "string.min": "attribute name must be at least 2 characters long",
    "string.max": "attribute name must not exceed 50 characters",
    "any.required": "attribute name is required",
  }),
});

// Subcategory Joi Schema
const subcategoryJoiSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "subcategory name must be a string",
    "string.empty": "subcategory name is required",
    "string.min": "subcategory name must be at least 2 characters long",
    "string.max": "subcategory name must not exceed 50 characters",
    "any.required": "subcategory name is required",
  }),

  subcategory_icon: Joi.string().min(2).max(20).required().messages({
    "string.base": "subcategory icon must be a string",
    "string.empty": "subcategory icon is required",
    "string.min": "subcategory icon must be at least 2 characters long",
    "string.max": "subcategory icon must not exceed 20 characters",
    "any.required": "subcategory icon is required",
  }),

  needSize: Joi.boolean().required().messages({
    "any.required": "need size is required",
    "boolean.base": "need size must be true or false",
  }),

  attributes: Joi.array()
    .items(attributeDefinitionJoiSchema)
    .min(1)
    .max(20)
    .required()
    .messages({
      "array.base": "attributes must be an array",
      "array.min": "please add at least one attribute",
      "array.max": "maximum limit reached, cann't add",
      "any.required": "attributes are required",
      "object.base": "each attribute must be an object with valid fields",
    }),
});

// Category Joi Schema
const categoryJoiSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "category name must be a string",
    "string.empty": "category name is required",
    "string.min": "category name must be at least 2 characters long",
    "string.max": "category name must not exceed 50 characters",
    "any.required": "category name is required",
  }),
  category_icon: Joi.string().min(2).max(20).required().messages({
    "string.base": "category icon must be a string",
    "string.empty": "category icon is required",
    "string.min": "category icon must be at least 2 characters long",
    "string.max": "category icon must not exceed 20 characters",
    "any.required": "category icon is required",
  }),
  subcategories: Joi.array()
    .items(subcategoryJoiSchema)
    .min(1)
    .required()
    .messages({
      "array.base": "subcategories must be an array",
      "array.min": "please add at least one subcategory",
      "object.base": "each subcategory must be an object with valid fields",
    }),
});
// Category  Name Joi Schema
const nameJoiSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "name must be a string",
    "string.empty": "name is required",
    "string.min": "name must be at least 2 characters long",
    "string.max": "name must not exceed 50 characters",
    "any.required": "name is required",
  }),
  icon: Joi.string().min(2).max(20).required().messages({
    "string.base": "icon must be a string",
    "string.empty": "icon is required",
    "string.min": "icon must be at least 2 characters long",
    "string.max": "icon must not exceed 20 characters",
    "any.required": "icon is required",
  }),
});

const attributesJoiSchema = Joi.object({
  attributes: Joi.array()
    .items(attributeDefinitionJoiSchema)
    .min(1)
    .max(20)
    .required()
    .messages({
      "array.base": "attributes must be an array",
      "array.min": "please add at least one attribute",
      "array.max": "maximum limit reached, cann't add",
      "any.required": "attributes are required",
      "object.base": "each attribute must be an object with valid fields",
    }),
});

const subcategoriesJoiSchema = Joi.object({
  subcategories: Joi.array()
    .items(subcategoryJoiSchema)
    .min(1)
    .required()
    .messages({
      "array.base": "subcategories must be an array",
      "array.min": "please add at least one subcategory",
      "object.base": "each subcategory must be an object with valid fields",
    }),
});

module.exports = {
  categoryJoiSchema,
  nameJoiSchema,
  attributesJoiSchema,
  subcategoriesJoiSchema,
};
