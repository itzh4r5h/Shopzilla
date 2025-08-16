const { User } = require("../../models/User");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { uploadToImageKit, imagekit } = require("../../utils/uploadImages");
const {
  joiEmailValidator,
  joiPasswordValidator,
} = require("../../validators/userValidator");
const { getBasicDetailsOnly } = require("../../utils/helpers");
const UserSearch = require("../../utils/userSearch");

// ====================== ADMIN --- GET ALL USERS =============================
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 10;
  const userCount = await User.countDocuments();

  let users = new UserSearch(User, req.query)
    .search()
    .pagination(resultPerPage);

  users = await users.query;

  res.status(200).json({
    success: true,
    users,
    userCount
  });
});

// ====================== ADMIN --- GET TOTAL NUMBER USERS =============================
exports.getTotalNumberOfUsers = catchAsyncErrors(async (req, res, next) => {
  const totalUsers = await User.countDocuments();

  res.status(200).json({
    success: true,
    totalUsers,
  });
});

// ====================== ADMIN --- DELETE USER =============================
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorHandler("user not exists", 400));
  }

  // code to remove imagekit images here
  if (user.profilePic.fileId !== process.env.IMAGE_KIT_DEFAULT_FILE_ID) {
      await imagekit.deleteFile(user.profilePic.fileId);
  }

  res.status(200).json({
    success: true,
    message: "user deleted",
  });
});

// ====================== GET USER INFO =============================
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.user._id).select("+password");

  let isPasswordExists = false;

  if (user.password) {
    isPasswordExists = true;
  }

  user = getBasicDetailsOnly(user);

  res.status(200).json({
    success: true,
    user,
    isPasswordExists,
  });
});

// ====================== UPDATE USER NAME =============================
exports.updateUserName = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  let user = await User.findById(req.user._id);

  if (!user.isVerified) {
    return next(new ErrorHandler("not allowed, verify email first", 403));
  }

  if (!name || name.toString().trim() === "") {
    return next(new ErrorHandler("name is required", 400));
  }

  user = await User.findByIdAndUpdate(
    req.user._id,
    { name },
    { runValidators: true, new: true }
  );

  user = getBasicDetailsOnly(user);

  res.status(200).json({
    success: true,
    message: "name updated",
    user,
  });
});

// ====================== UPDATE USER EMAIL =============================
exports.updateUserEmail = catchAsyncErrors(async (req, res, next) => {
  // get email for request body
  const { email } = req.body;

  let user = await User.findByIdAndUpdate(
    req.user._id,
    { email },
    { runValidators: true, new: true }
  );

  user = getBasicDetailsOnly(user);

  res.status(200).json({
    success: true,
    message: "email updated",
    user,
  });
});

// ====================== CANCEL UPDATE USER EMAIL =============================
exports.cancelUpdateUserEmail = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.user._id);

  user.otp = undefined;
  user.otpExpire = undefined;
  user.resendOtpIn = undefined;

  await user.save({ validateBeforeSave: false });

  user = getBasicDetailsOnly(user);

  res.status(200).json({
    success: true,
    message: "email updation cancelled",
    user,
  });
});

// ====================== UPDATE PROFILE PICTURE =============================
exports.updateUserProfilePic = catchAsyncErrors(async (req, res, next) => {
  const { buffer, originalname } = req.file;

  let user = await User.findById(req.user._id);
  if (user.profilePic.fileId !== process.env.IMAGE_KIT_DEFAULT_FILE_ID) {
    await imagekit.deleteFile(user.profilePic.fileId);
  }

  const { url, fileId } = await uploadToImageKit(
    buffer,
    originalname,
    `${process.env.USER_PICS_FOLDER}/${req.user._id}`
  );

  // then saves the url and fileId in db
  user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePic: { url, fileId, name: originalname.split(".")[0] } },
    { runValidators: true, new: true }
  );

  user = getBasicDetailsOnly(user);

  res.status(200).json({
    success: true,
    message: "picture updated",
    user,
  });
});

// ====================== CREATE PASSWORD =============================
exports.createPassword = catchAsyncErrors(async (req, res, next) => {
  const { newPassword } = req.body;

  const error = joiPasswordValidator({ password: newPassword });

  if (error) {
    const msg = error.message.replaceAll('"', "");
    return next(new ErrorHandler(msg, 400));
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user.isGoogleUser) {
    return next(new ErrorHandler("Not allowed", 403));
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: "password created",
    isPasswordExists: true,
  });
});

// ====================== UPDATE PASSWORD =============================
exports.updateUserPassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (
    !oldPassword ||
    !newPassword ||
    oldPassword.toString().trim() === "" ||
    newPassword.toString().trim() === ""
  ) {
    return next(new ErrorHandler("enter old password & new password", 400));
  }

  const user = await User.findById(req.user._id).select("+password");

  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is invalid", 400));
  }

  if (oldPassword === newPassword) {
    return next(
      new ErrorHandler("new password cann't be same as old one", 400)
    );
  }

  const error = joiPasswordValidator({ password: newPassword });

  if (error) {
    const msg = error.message.replaceAll('"', "");
    return next(new ErrorHandler(msg, 400));
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: "password updated",
  });
});
