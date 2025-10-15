const { User } = require("../../models/User");
const { Product } = require("../../models/product/Product");
const { Variant } = require("../../models/product/Variant");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { isOnlyDigits } = require("../../utils/helpers");

// ========================= ADD PRODUCT TO CART OR UPDATE PRODUCT QUANTITY =========================
exports.addProductToCartOrUpdateQuantity = catchAsyncErrors(
  async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (user.shippingAddress.length === 0) {
      return next(new ErrorHandler("add address first", 400));
    }

    const variant = await Variant.findById(req.params.id);

    if (!variant) {
      return next(new ErrorHandler("product not exists", 404));
    }

    const { quantity, colorIndex, sizeIndex } = req.body;

    if (typeof colorIndex !== "number" && !colorIndex) {
      return next(new ErrorHandler("color is required"));
    }

    if (!quantity || quantity.toString().trim() === "") {
      return next(new ErrorHandler("quantity is required", 400));
    }

    if (!isOnlyDigits(quantity)) {
      return next(new ErrorHandler("quantity must be a number", 400));
    }

    // if need size is true
    if (variant.needSize) {
      if (typeof sizeIndex !== "number" && !sizeIndex) {
        return next(new ErrorHandler("size is required"));
      }

      if (
        Number(quantity) > variant.images[colorIndex].sizes[sizeIndex].stock ||
        variant.images[colorIndex].sizes[sizeIndex].stock === 0
      ) {
        return next(new ErrorHandler("oops! not enough stock", 400));
      }
    } else {
      if (
        Number(quantity) > variant.images[colorIndex].stock ||
        variant.images[colorIndex].stock === 0
      ) {
        return next(new ErrorHandler("oops! not enough stock", 400));
      }
    }
    // condition ends

    const isAdded = user.cartProducts.find(
      (cartProduct) =>
        cartProduct.variant.toString() === variant._id.toString() &&
        cartProduct.colorIndex === colorIndex
    );

    if (isAdded) {
      user.cartProducts.forEach((cartProduct) => {
        if (cartProduct.variant.toString() === variant._id.toString() &&
        cartProduct.colorIndex === colorIndex) {
          cartProduct.quantity = quantity;
          cartProduct.colorIndex = colorIndex;
          if (variant.needSize) {
            cartProduct.sizeIndex = sizeIndex;
          }
        }
      });
      await user.save({ validateBeforeSave: true });

      res.status(200).json({
        success: true,
        message: "cart updated",
        updated: true,
      });
    } else {
      if (variant.needSize) {
        user.cartProducts.push({
          variant: variant._id,
          needSize: variant.needSize,
          quantity,
          colorIndex,
          sizeIndex,
        });
      } else {
        user.cartProducts.push({
          variant: variant._id,
          needSize: variant.needSize,
          quantity,
          colorIndex,
        });
      }
      await user.save({ validateBeforeSave: true });

      res.status(200).json({
        success: true,
        message: "added to cart",
      });
    }
  }
);

// ========================= GET ALL PRODUCTS WHICH ARE ADDED IN CART =========================
exports.getAllProductsOfCart = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: "cartProducts.variant",
    populate: {
      path: "product",
    },
  });

  let cartProductsQuantity = 0;
  let totalPrice = 0;

  if (user.cartProducts.length > 0) {
    user.cartProducts.forEach((cartProduct) => {
      if (cartProduct.variant.needSize) {
        // checking if stock is greater or equal to selected product quantity
        // so that out of stock products will not count
        if (
          cartProduct.variant.images[cartProduct.colorIndex].sizes[
            cartProduct.sizeIndex
          ].stock >= cartProduct.quantity
        ) {
          cartProductsQuantity += cartProduct.quantity;
          totalPrice +=
            cartProduct.variant.images[cartProduct.colorIndex].price *
            cartProduct.quantity;
        }
      } else {
        // checking if stock is greater or equal to selected product quantity
        // so that out of stock products will not count
        if (
          cartProduct.variant.images[cartProduct.colorIndex].stock >=
          cartProduct.quantity
        ) {
          cartProductsQuantity += cartProduct.quantity;
          totalPrice +=
            cartProduct.variant.images[cartProduct.colorIndex].price *
            cartProduct.quantity;
        }
      }
    });
  }

  res.status(200).json({
    success: true,
    cartProducts: user.cartProducts,
    cartProductsQuantity,
    totalPrice,
  });
});

// ========================= REMOVE PRODUCT FROM CART =========================
exports.removeProductFromCart = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const variant = await Variant.findById(req.params.id);

  if (!variant) {
    return next(new ErrorHandler("product not exists", 404));
  }

  const cartProducts = user.cartProducts.filter(
    (cartProduct) =>
      !(
        cartProduct.variant.toString() === variant._id.toString() &&
        cartProduct.colorIndex === Number(req.params.colorIndex)
      )
  );

  await User.findByIdAndUpdate(
    req.user._id,
    { cartProducts },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "removed from cart",
  });
});
