const { User } = require("../../models/User");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { uploadToImageKit } = require("../../utils/uploadImages");
const sendToken = require("../../utils/sendToken");
const {
  createHashWithCrypto,
  getBasicDetailsOnly,
} = require("../../utils/helpers");
const {
  joiValidator,
  joiPasswordValidator,
} = require("../../validators/userValidator");
const { deletionQueue } = require("../../jobs/queue");

// ====================== SIGNUP/SIGNIN USER WITH GOOGLE =============================
exports.signInWithGoogle = catchAsyncErrors(async (req, res, next) => {
  const { name, email } = req.user;
  // finding a user
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      isGoogleUser: true,
      isVerified: true,
    });
  }

  const token = user.getJWTToken();

  // options for cookie
  const options = {
    maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // secure: true //enable it when in production
  };

  res.cookie("token", token, options);

  res.redirect(`${process.env.FRONTEND_URL}/profile/?google_user=true`);
});

// ====================== SIGN UP USER =============================
exports.signUpUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const error = joiValidator({ name, email, password });

  if (error) {
    const msg = error.message.replaceAll('"', "");
    return next(new ErrorHandler(msg, 400));
  }

  // finding a user
  let user = await User.findOne({ email });

  // if user exists
  if (user) {
    return next(new ErrorHandler("account already exists", 400));
  }

  user = await User.create({ name, email, password });

  sendToken(user, 201, res);

  // Schedule job to delete user after specified minutes
  await deletionQueue.add(
    "delete-user",
    { userId: user._id },
    {
      delay: process.env.USER_DELETION_MINUTES * 60 * 1000 + 3000,
      jobId: `delete-user-${user._id}`,
    }
  );
});

// ====================== SIGN IN USER =============================
exports.signInUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (
    !email ||
    !password ||
    email.toString().trim() === "" ||
    password.toString().trim() === ""
  ) {
    return next(new ErrorHandler("enter email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("invalid credentials", 401));
  }

  if (!user.password) {
    return next(new ErrorHandler("Use sign in with google", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("invalid credentials", 401));
  }

  return sendToken(user, 200, res);
});

// ====================== SIGN OUT THE USER =============================
exports.signOut = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "signed out",
  });
});

// ====================== VERIFY USER EMAIL =============================
exports.verifyUserEmail = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const emailVerificationToken = createHashWithCrypto(req.params.token);

  let user = await User.findOne({
    emailVerificationToken,
    emailVerificationTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("token is invalid or expired", 404));
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpire = undefined;
  user.resendLinkIn = undefined;
  await user.save({ validateBeforeSave: false });

  user = getBasicDetailsOnly(user);

  const job = await deletionQueue.getJob(`delete-user-${user._id}`);
  if (job) {
    await job.remove();
    console.log(`Job for user ${user._id} deleted successfully`);
  }

  res.status(200).json({
    success: true,
    user: user,
    message: "email verified",
  });
});

// ====================== RESET PASSWORD =============================
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { password } = req.body;

  const error = joiPasswordValidator({ password });

  if (error) {
    const msg = error.message.replaceAll('"', "");
    return next(new ErrorHandler(msg, 400));
  }

  // creating token hash
  const resetPasswordToken = createHashWithCrypto(req.params.token);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("token is invalid or expired", 404));
  }

  if (!user.isVerified) {
    return next(new ErrorHandler("Account no longer exists", 410));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  user.resendTokenIn = undefined;
  await user.save({ validateBeforeSave: true });

  sendToken(user, 200, res);
});
