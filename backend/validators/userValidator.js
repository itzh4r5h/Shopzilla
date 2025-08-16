const Joi = require("joi");

const passwordObj = {
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
      )
    )
    .required()
    .messages({
      "string.empty": "password is required",
      "string.min": "password must be at least 8 characters",
      "string.max": "password cann't exceed 20 characters",
      "string.pattern.base":
        "password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, #, $, )",
    }),
};

const joiValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    ...passwordObj,
  });

  const { error } = schema.validate(data);
  return error;
};

const joiEmailValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(data);
  return error;
};

const joiPasswordValidator = (data) => {
  const schema = Joi.object({
    ...passwordObj,
  });

  const { error } = schema.validate(data);
  return error;
};

const joiAddressValidator = (data) => {
  const schema = Joi.object({
    address: Joi.string().trim().max(255).required().messages({
      "string.empty": "address is required",
      "string.max": "address must be at most 255 characters",
    }),

    country: Joi.string().trim().max(85).required().messages({
      "string.empty": "country is required",
      "string.max": "country must be at most 85 characters",
    }),

    state: Joi.string().trim().max(85).required().messages({
      "string.empty": "state is required",
      "string.max": "state must be at most 85 characters",
    }),

    city: Joi.string().trim().max(85).required().messages({
      "string.empty": "city is required",
      "string.max": "city must be at most 85 characters",
    }),

    pinCode: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.empty": "pin code is required",
        "string.length": "pin code must be exactly 6 digits",
        "string.pattern.base": "pin code must contain only digits",
      }),

    mobileNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.empty": "mobile number is required",
        "string.length": "mobile number must be exactly 10 digits",
        "string.pattern.base": "moile number must contain only digits",
      }),
  });
  const { error } = schema.validate(data);
  return error;
};

module.exports = {
  joiAddressValidator,
  joiEmailValidator,
  joiPasswordValidator,
  joiValidator,
};
