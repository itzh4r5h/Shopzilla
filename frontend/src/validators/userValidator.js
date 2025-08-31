import Joi from "joi";

export const shippingAddressJoiSchema = Joi.object({
  address: Joi.string().trim().max(255).required().messages({
    "string.empty": "Address is required",
    "string.max": "Address must be at most 255 characters",
  }),

  country: Joi.string().trim().max(85).required().messages({
    "string.empty": "Country is required",
    "string.max": "Country must be at most 85 characters",
  }),

  state: Joi.string().trim().max(85).required().messages({
    "string.empty": "State is required",
    "string.max": "State must be at most 85 characters",
  }),

  city: Joi.string().trim().max(85).required().messages({
    "string.empty": "City is required",
    "string.max": "City must be at most 85 characters",
  }),

  pinCode: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.empty": "Pin code is required",
      "string.length": "Pin code must be exactly 6 digits",
      "string.pattern.base": "Pin code must contain only digits",
    }),

  mobileNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.length": "Mobile number must be exactly 10 digits",
      "string.pattern.base": "Mobile number must contain only digits",
    }),
});

export const emailJoiSchema = (resendOtpIn) => {
  const baseSchema = {};
  baseSchema.email = Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email",
    });

  if (resendOtpIn) {
    baseSchema.otp = Joi.string()
      .alphanum()
      .trim()
      .min(6)
      .max(6)
      .required()
      .messages({
        "string.empty": "OTP is required",
        "string.min": "OTP must be at least 6 characters",
        "string.max": "OTP cann't exceed 6 characters",
        "string.alphanum": "OTP must contain only letters and numbers",
      });
  }

  return Joi.object(baseSchema);
};

export const userNameSchema = Joi.object({
  name: Joi.string().trim().min(3).max(20).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cann't exceed 20 characters",
  }),
});

export const userPasswordSchema = (isPasswordExists) => {
  const baseSchema = {};

  if (isPasswordExists) {
    baseSchema.oldPassword = Joi.string()
      .trim()
      .min(8)
      .max(20)
      .pattern(
        new RegExp(
          "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
        )
      )
      .required()
      .messages({
        "string.empty": "Old Password is required",
        "string.min": "Old Password must be at least 8 characters",
        "string.max": "Old Password cann't exceed 20 characters",
        "string.pattern.base":
          "Old Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, #, $, )",
      });
  }

  baseSchema.newPassword = Joi.string()
    .trim()
    .min(8)
    .max(20)
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
      )
    )
    .required()
    .messages({
      "string.empty": "New Password is required",
      "string.min": "New Password must be at least 8 characters",
      "string.max": "New Password cann't exceed 20 characters",
      "string.pattern.base":
        "Old Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, #, $, )",
    });

  return Joi.object(baseSchema);
};

export const resetPasswordJoiSchema = (token) => {
  const baseSchema = {};
  if (!token) {
    baseSchema.email = Joi.string()
      .trim()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email",
      });
  } else {
    baseSchema.password = Joi.string()
      .trim()
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
      });
  }

  return Joi.object(baseSchema);
};

export const signInSignUpJoiSchema = (title) => {
  const baseSchema = {};
  if (title.toLowerCase() === "sign up") {
    baseSchema.name = Joi.string().trim().min(3).max(20).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name cann't exceed 20 characters",
    });
  }

  baseSchema.email = Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email",
    });

  baseSchema.password = Joi.string()
    .trim()
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
    });

  return Joi.object(baseSchema);
};
