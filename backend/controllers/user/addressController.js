const { User } = require("../../models/User");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { joiAddressValidator } = require("../../validators/userValidator");
const { isOnlyDigits } = require("../../utils/helpers");

// ============================ CREATE SHIPPING ADDRESS =======================
exports.addNewShippingAddress = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user.shippingAddress.length === 5) {
    return next(new ErrorHandler("only 5 address are allowed"));
  }

  const { address, city, state, country, pinCode, mobileNumber } = req.body;

  const error = joiAddressValidator({
    address,
    city,
    state,
    country,
    pinCode,
    mobileNumber,
  });

  if (error) {
    const msg = error.message.replaceAll('"', "");
    return next(new ErrorHandler(msg, 400));
  }

  user.shippingAddress.push({
    address,
    city,
    state,
    country,
    pinCode: Number(pinCode),
    mobileNumber: Number(mobileNumber),
  });
  await user.save({ validateBeforeSave: true });

  res.status(201).json({
    success: true,
    message: "address added",
  });
});

// ============================ GET SHIPPING ADDRESS =======================
exports.getShippingAddress = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const shippingAddress = user.shippingAddress.find(
    (address) => address._id.toString() === req.params.id.toString()
  );

  if (!shippingAddress) {
    return next(new ErrorHandler("address not exists", 404));
  }

  res.status(200).json({
    success: true,
    shippingAddress,
  });
});

// ============================ GET ALL SHIPPING ADDRESS =======================
exports.getAllShippingAddress = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("user not exists", 404));
  }

  res.status(200).json({
    success: true,
    allShippingAddress: user.shippingAddress,
    shippingAddressIndex: user.shippingAddressIndex
  });
});

// ============================ UPDATE SHIPPING ADDRESS =======================
exports.updateShippingAddress = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const isShippingAddressExists = user.shippingAddress.find(
    (address) => address._id.toString() === req.params.id.toString()
  );

  if (!isShippingAddressExists) {
    return next(new ErrorHandler("address not exists", 404));
  }

  const { address, city, state, country, pinCode, mobileNumber } = req.body;

  const error = joiAddressValidator({
    address,
    city,
    state,
    country,
    pinCode,
    mobileNumber,
  });

  if (error) {
    const msg = error.message.replaceAll('"', "");
    return next(new ErrorHandler(msg, 400));
  }

  user.shippingAddress.forEach((oldAddress) => {
    if (oldAddress._id.toString() === req.params.id.toString()) {
      oldAddress.address = address;
      oldAddress.city = city;
      oldAddress.state = state;
      oldAddress.pinCode = pinCode;
      oldAddress.mobileNumber = mobileNumber;
    }
  });

  await user.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: "address updated",
  });
});

// ============================ UPDATE SHIPPING ADDRESS INDEX =======================
exports.updateShippingAddressIndex = catchAsyncErrors(
  async (req, res, next) => {
    const user = await User.findById(req.user._id);

    const { shippingAddressIndex } = req.body;

    if (
      !shippingAddressIndex ||
      shippingAddressIndex.toString().trim() === ""
    ) {
      return next(new ErrorHandler("address is required", 400));
    }

    if (
      !isOnlyDigits(shippingAddressIndex) ||
      Number(shippingAddressIndex) > user.shippingAddress.length
    ) {
      return next(new ErrorHandler("invalid address", 400));
    }

    user.shippingAddressIndex = shippingAddressIndex;
    await user.save({ validateBeforeSave: true });

    res.status(200).json({
      success: true,
      user,
    });
  }
);

// ============================ DELETE SHIPPING ADDRESS =======================
exports.deleteShippingAddress = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const isShippingAddressExists = user.shippingAddress.find(
    (address) => address._id.toString() === req.params.id.toString()
  );

  if (!isShippingAddressExists) {
    return next(new ErrorHandler("address not exists", 404));
  }

  let shippingAddressIndex = user.shippingAddressIndex
  const currentShippingAddressId = user.shippingAddress.find((address,index)=>index+1===shippingAddressIndex)._id

  const shippingAddress = user.shippingAddress.filter(
    (address,index) => {
      if(address._id.toString() === req.params.id.toString()){
        if(index+1 === user.shippingAddressIndex){
          shippingAddressIndex = 1
        }
        return false
      }
      return true
    }
  );

  // it is mandatory to update shippingAddessIndex as shippingAddress array length has been changed
  for (let index = 0; index < shippingAddress.length; index++) {
    if(shippingAddress[index]._id.toString() === currentShippingAddressId.toString()){
      shippingAddressIndex = index+1
      break
    }
  }


  await User.findByIdAndUpdate(
    req.user._id,
    { shippingAddress,shippingAddressIndex },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "address deleted",
  });
});
