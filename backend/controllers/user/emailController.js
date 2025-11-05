const { User } = require("../../models/User");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const sendEmail = require("../../utils/sendEmail");
const {
  OTP_VERIFICATION,
  RESET_PASSWORD,
  EMAIL_VERIFICATION,
} = require("../../constants/userConstants");
const { joiEmailValidator } = require("../../validators/userValidator");

// ====================== SEND RESET PASSWORD TOKEN TO USER EMAIL  =============================
exports.sendEmailForResetPassword = catchAsyncErrors(async (req, res, next) => {
  // get email for request body
  const { email } = req.body;

  if (!email || email.toString().trim() === "") {
    return next(new ErrorHandler("email is required", 400));
  }

  const error = joiEmailValidator({ email });

  if (error) {
    const msg = error.message.replaceAll('"', "");
    return next(new ErrorHandler(msg, 400));
  }

  // finding user with that email
  const user = await User.findOne({ email });

  // if user not exists throw an error
  if (!user) {
    return next(new ErrorHandler("user not exists", 404));
  }

  const resendTime = new Date(user.resendTokenIn).getTime(); // timestamp in ms

  if (Date.now() < resendTime) {
    const timePendingMs = resendTime - Date.now();
    return next(
      new ErrorHandler(
        `you can resend after ${Math.floor(timePendingMs / 1000)}s`,
        400
      )
    );
  }

  try {
    user.resendTokenIn = new Date(
      Date.now() + process.env.RESEND_EMAIL_IN_MINUTES * 60 * 1000
    );

    // get token
    const resetToken = user.generateTokenFor(RESET_PASSWORD);
    // saving the token
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset/password/${resetToken}`;

    const message = `Your password reset url - ${resetPasswordUrl}`;

    const { success, message: msg } = await sendEmail({
      email: user.email,
      subject: `Shopzilla - Reset Password`,
      message,
    });

    if (success) {
      res.status(200).json({
        success: true,
        resendTokenIn: user.resendTokenIn,
        message: `Email sent to ${user.email}`,
      });
    } else {
      return next(new ErrorHandler(msg, 400));
    }
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    user.resendTokenIn = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(err.message, 500));
  }
});

// ====================== SEND EMAIL VERIFICATION LINK TO USER EMAIL  =============================
exports.sendEmailForEmailVerification = catchAsyncErrors(
  async (req, res, next) => {
    // finding user with that email
    const user = await User.findOne({ email: req.user.email });

    // if user not exists throw an error
    if (!user) {
      return next(new ErrorHandler("user not exists", 404));
    }

    if (user.isVerified) {
      return next(new ErrorHandler("Email already verified", 400));
    }

    const resendTime = new Date(user.resendLinkIn).getTime(); // timestamp in ms

    if (Date.now() < resendTime) {
      const timePendingMs = resendTime - Date.now();
      return next(
        new ErrorHandler(
          `you can resend after ${Math.floor(timePendingMs / 1000)}s`,
          400
        )
      );
    }

    try {
      user.resendLinkIn = new Date(
        Date.now() + process.env.RESEND_EMAIL_IN_MINUTES * 60 * 1000
      );
      // get token
      const emailVerificationToken = user.generateTokenFor(EMAIL_VERIFICATION);
      // saving the token
      await user.save({ validateBeforeSave: false });

      const emailVerificationUrl = `${process.env.FRONTEND_URL}/profile/${emailVerificationToken}`;

      const message = `Your email verification url - ${emailVerificationUrl}`;

      const { success, message: msg } = await sendEmail({
        email: user.email,
        subject: `Shopzilla - Verify Email`,
        message,
      });

      if (success) {
        res.status(200).json({
          success: true,
          resendLinkIn: user.resendLinkIn,
          message: `Email sent to ${user.email}`,
        });
      } else {
        return next(new ErrorHandler(msg, 400));
      }
    } catch (err) {
      user.emailVerificationToken = undefined;
      user.emailVerificationTokenExpire = undefined;
      user.resendLinkIn = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// ====================== SEND OTP TO USER EMAIL  =============================
exports.sendOtpToEmail = catchAsyncErrors(async (req, res, next) => {
  // get email for request body
  const { email } = req.body;

  const user = await User.findById(req.user._id);

  if (!user.isVerified) {
    return next(new ErrorHandler("not allowed, verify email first", 403));
  }

  if (!email || email.toString().trim() === "") {
    return next(new ErrorHandler("email is required", 400));
  }

  const error = joiEmailValidator({ email });

  if (error) {
    const msg = error.message.replaceAll('"', "");
    return next(new ErrorHandler(msg, 400));
  }

  // first check if it's the same email as old one
  if (email === user.email) {
    return next(new ErrorHandler("new email cann't be same as old one", 400));
  }

  // finding user with that email
  let anyExistingUser = await User.findOne({ email });

  // if user exists
  if (anyExistingUser) {
    return next(new ErrorHandler("user already exists", 400));
  }

  const resendTime = new Date(user.resendOtpIn).getTime(); // timestamp in ms

  if (Date.now() < resendTime) {
    const timePendingMs = resendTime - Date.now();
    return next(
      new ErrorHandler(
        `you can resend after ${Math.floor(timePendingMs / 1000)}s`,
        400
      )
    );
  }

  try {
    user.resendOtpIn = new Date(
      Date.now() + process.env.RESEND_EMAIL_IN_MINUTES * 60 * 1000
    );
    // generate otp
    user.generateTokenFor(OTP_VERIFICATION);
    // saving the otp
    await user.save({ validateBeforeSave: false });

    const otp = user.otp;
    const message = `Your otp is - ${otp}`;

    const { success, message: msg } = await sendEmail({
      email,
      subject: `Shopzilla - Verify Email With OTP`,
      message,
    });

    if (success) {
      res.status(200).json({
        success: true,
        resendOtpIn: user.resendOtpIn,
        message: `Email sent to ${email}`,
      });
    } else {
      return next(new ErrorHandler(msg, 400));
    }
  } catch (err) {
    user.otp = undefined;
    user.otpExpire = undefined;
    user.resendOtpIn = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(err.message, 500));
  }
});
