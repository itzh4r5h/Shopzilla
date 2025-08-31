import Joi from "joi";

export const productJoiSchema = Joi.object({
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

  category: Joi.string().min(2).max(50).required().messages({
    "string.base": "category must be a string",
    "string.empty": "category is required",
    "string.min": "category must be at least 2 characters long",
    "string.max": "category must not exceed 50 characters",
    "any.required": "category is required",
  }),

  subcategory: Joi.string().min(2).max(50).required().messages({
    "string.base": "subcategory must be a string",
    "string.empty": "subcategory is required",
    "string.min": "subcategory must be at least 2 characters long",
    "string.max": "subcategory must not exceed 50 characters",
    "any.required": "subcategory is required",
  }),
});

//   stock: Joi.number().min(0).messages({
//     "number.base": "Stock must be a number",
//     "number.min": "Stock cannot be negative",
//   }),

//  price: Joi.number().min(0).required().messages({
//     "number.base": "Price must be a number",
//     "number.min": "Price cannot be negative",
//     "any.required": "Price is required",
//   }),

// images: Joi.array()
//   .items(
//     Joi.custom((file, helpers) => {
//       if (file.url) {
//         return file;
//       }
//       const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

//       if (!allowedTypes.includes(file.type)) {
//         return helpers.error("file.type");
//       }

//       if (file.size > MAX_SIZE_BYTES) {
//         return helpers.error("file.size");
//       }

//       return file; // valid
//     })
//   )
//   .min(1)
//   .max(maxImages)
//   .required()
//   .messages({
//     "array.base": "Images must be in an array format",
//     "array.min": "Please upload at least one image",
//     "array.max": `You can upload a maximum of ${maxImages} images`,
//     "file.type": "Only PNG or JPEG files are allowed",
//     "file.size": `File size must not exceed ${MAX_SIZE_MB}MB`,
//   });
