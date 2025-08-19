const { User } = require("../../models/User");
const { Product } = require("../../models/product/Product");
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

    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("product not exists", 404));
    }

    const { quantity } = req.body;

    if (!quantity || quantity.toString().trim() === "") {
      return next(new ErrorHandler("quantity is required", 400));
    }

    if (!isOnlyDigits(quantity)) {
      return next(new ErrorHandler("quantity must be a number", 400));
    }

    if (Number(quantity) > product.stock || product.stock === 0) {
      return next(new ErrorHandler("oops! not enough stock", 400));
    }

    const isAdded = user.cartProducts.find(
      (cartProduct) => cartProduct.product.toString() === product._id.toString()
    );

    if (isAdded) {
      user.cartProducts.forEach((cartProduct) => {
        if (cartProduct.product.toString() === product._id.toString()) {
          cartProduct.quantity = quantity;
        }
      });
      await user.save({ validateBeforeSave: true });

      res.status(200).json({
        success: true,
        message: "product quantity updated",
        updated: true,
      });
    } else {
      user.cartProducts.push({
        product: product._id,
        quantity,
      });
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
  const user = await User.findById(req.user._id).populate(
    "cartProducts.product"
  );

  let cartProductsQuantity = 0;
  let totalPrice = 0;

  user.cartProducts.forEach((cartProduct) => {
    if (cartProduct.product.stock >= cartProduct.quantity) {
      cartProductsQuantity += cartProduct.quantity;
      totalPrice += cartProduct.product.price * cartProduct.quantity;
    }
  });

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

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not exists", 404));
  }

  const cartProducts = user.cartProducts.filter(
    (cartProduct) => cartProduct.product.toString() !== product._id.toString()
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
