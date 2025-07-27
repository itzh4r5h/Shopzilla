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
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password cann't exceed 20 characters",
      "string.pattern.base":
        "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, #, $, )",
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
    address: Joi.string().trim().max(255).required(),
    city: Joi.string().trim().max(85).required(),
    state: Joi.string().trim().max(85).required(),
    country: Joi.string().trim().max(85).required(),
    pinCode: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required(),
    mobileNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
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
