import Joi from "joi";

// Attribute Joi Schema
const attributeDefinitionJoiSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "attribute name must be a string",
    "string.empty": "attribute name is required",
    "string.min": "attribute name must be at least 2 characters long",
    "string.max": "attribute name must not exceed 50 characters",
    "any.required": "attribute name is required",
  }),

  type: Joi.string()
    .valid("string", "number", "boolean", "enum")
    .required()
    .messages({
      "any.only": "attribute type must be from one of these - string, number, boolean or enum",
      "any.required": "attribute type is required",
      "string.base": "attribute type must be a string",
    }),
});

// Subcategory Joi Schema
export const subcategoryJoiSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "subcategory name must be a string",
    "string.empty": "subcategory name is required",
    "string.min": "subcategory name must be at least 2 characters long",
    "string.max": "subcategory name must not exceed 50 characters",
    "any.required": "subcategory name is required",
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
export const categoryJoiSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "category name must be a string",
    "string.empty": "category name is required",
    "string.min": "category name must be at least 2 characters long",
    "string.max": "category name must not exceed 50 characters",
    "any.required": "category name is required",
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
})
// Category  Name Joi Schema
export const nameJoiSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "name must be a string",
    "string.empty": "name is required",
    "string.min": "name must be at least 2 characters long",
    "string.max": "name must not exceed 50 characters",
    "any.required": "name is required",
  }),
});
