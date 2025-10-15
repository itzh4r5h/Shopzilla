const mongoose = require("mongoose");
const validator = require("validator");
const { createHashWithCrypto } = require("../utils/helpers");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  RESET_PASSWORD,
  EMAIL_VERIFICATION,
  OTP_VERIFICATION,
} = require("../constants/userConstants");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    trim: true,
    minLength: [3, "name should be at least 3 characters long"],
    maxLength: [20, "name can not exceed 20 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
    trim: true,
    validate: [validator.isEmail, "enter a valid email"],
  },
  password: {
    type: String,
    required: [
      function () {
        return !this.isGoogleUser;
      },
      "password is required",
    ],
    minLength: [8, "password should be at least 8 characters long"],
    trim: true,
    select: false,
  },
  isGoogleUser: { type: Boolean, default: false },
  profilePic: {
    url: {
      type: String,
      required: [true, "image url is required"],
      default: process.env.IMAGE_KIT_DEFAULT_URL,
    },
    fileId: {
      type: String,
      required: [true, "image file-id is required"],
      default: process.env.IMAGE_KIT_DEFAULT_FILE_ID,
    },
    name: {
      type: String,
      required: [true, "image name is required"],
      default: "profilePic",
    },
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resendLinkIn: Date,
  resendOtpIn: Date,
  resendTokenIn: Date,

  otp: String,
  otpExpire: Date,

  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,

  emailVerificationToken: String,
  emailVerificationTokenExpire: Date,

  cartProducts: [
    {
      variant: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" },
      needSize: {
        type: Boolean,
        required: [true, "need size is required"],
      },
      quantity: {
        type: Number,
        min: [1, "quantity cann't be less than 1"],
        required: [true, "quantity is required"],
      },
      colorIndex: {
        type: Number,
        required: [true, "color is required"],
      },
      sizeIndex: {
        type: Number,
        required: [
          function () {
            return this.needSize;
          },
          "size is required",
        ],
      },
    },
  ],

  orderedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  shippingAddressIndex: {
    type: Number,
    default: 1,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  shippingAddress: [
    {
      address: {
        type: String,
        trim: true,
        maxLength: [255, "address cannot exceed 255 characters"],
        required: [true, "address is required"],
      },
      city: {
        type: String,
        trim: true,
        required: [true, "city is required"],
        maxLength: [85, "city cannot exceed 85 characters"],
      },
      state: {
        type: String,
        trim: true,
        required: [true, "state is required"],
        maxLength: [85, "state cannot exceed 85 characters"],
      },
      country: {
        type: String,
        trim: true,
        required: [true, "country is required"],
        maxLength: [85, "country cannot exceed 85 characters"],
      },
      pinCode: {
        type: Number,
        required: [true, "pin-code is required"],
      },
      mobileNumber: {
        type: Number,
        required: [true, "mobile number is required"],
      },
    },
  ],
});

// =========================== USER METHODS ====================================

userSchema.pre("save", async function (next) {
  // if password not changed then move to next task
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// comparing the entered password and user original password
userSchema.methods.comparePassword = async function (password) {
  // it will return true or false
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateTokenFor = function (value) {
  // randomBytes gives data in buffer then toString method converts it into hex value
  const token = crypto.randomBytes(20).toString("hex");
  const expireTime = Date.now() + 5 * 60 * 60 * 1000;

  switch (value) {
    case RESET_PASSWORD:
      this.resetPasswordToken = createHashWithCrypto(token);
      this.resetPasswordTokenExpire = expireTime;
      break;
    case EMAIL_VERIFICATION:
      this.emailVerificationToken = createHashWithCrypto(token);
      this.emailVerificationTokenExpire = expireTime;
      break;
    case OTP_VERIFICATION:
      this.otp = createHashWithCrypto(token).slice(6, 12); // for getting 6 character hex code
      this.otpExpire = Date.now() + 2 * 60 * 60 * 1000;
      break;
  }

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
