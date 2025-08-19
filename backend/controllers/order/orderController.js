const { User } = require("../../models/User");
const { Product } = require("../../models/product/Product");
const { Order } = require("../../models/Order");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { isOnlyDigits } = require("../../utils/helpers");
const { Payment } = require("../../models/Payment");

// ========================== CREATE NEW ORDER FROM CART PRODUCTS ================================
exports.createNewOrder = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate(
    "cartProducts.product"
  );

  if (user.shippingAddress.length === 0) {
    return next(new ErrorHandler("add address first", 400));
  }

  const { buyNow } = req.body;

  const shippingAddressIndex = user.shippingAddressIndex;

  const shippingAddress =
    user.shippingAddress[Number(shippingAddressIndex) - 1];

  const orderItems = [];
  let itemsPrice = 0;

  if (buyNow) {
    const singleProduct = await Product.findById(req.params.productId);

    if (!singleProduct) {
      return next(new ErrorHandler("product not exists", 404));
    }

    const quantity = req.params.quantity;

    if (
      !quantity ||
      !isOnlyDigits(quantity) ||
      Number(quantity) > singleProduct.stock
    ) {
      return next(new ErrorHandler("invalid quantity", 400));
    }

    if (singleProduct.stock < Number(quantity)) {
      return next(new ErrorHandler("not enough stock", 400));
    }

    const item = {
      name: singleProduct.name,
      price: singleProduct.price,
      quantity: Number(quantity),
      image: singleProduct.images[0].url,
      id: singleProduct._id,
    };

    orderItems.push(item);
    itemsPrice = singleProduct.price * Number(quantity);
  } else {
    if (
      user.cartProducts.length < 2 &&
      user.cartProducts[0].product.stock < user.cartProducts[0].quantity
    ) {
      return next(new ErrorHandler("not enough stock", 400));
    }

    user.cartProducts.forEach((cartProduct) => {
      const { product } = cartProduct;
      if (product.stock >= cartProduct.quantity) {
        const item = {
          name: product.name,
          price: product.price,
          quantity: cartProduct.quantity,
          image: product.images[0].url,
          id: product._id,
        };
        orderItems.push(item);
        itemsPrice += product.price * cartProduct.quantity;
      }
    });
  }

  const shippingPrice = itemsPrice > 500 ? 0 : 79;
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    orderId: order._id,
  });
});

// ========================== GET MY ORDER ================================
exports.getMyOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findOne({
    user: req.user._id,
    _id: req.params.id,
    orderStatus: { $ne: "pending" },
  });

  if (!order) {
    return next(new ErrorHandler("order not exists", 404));
  }

  let orderQuantity = 0;

  order.orderItems.forEach((item) => {
    orderQuantity += item.quantity;
  });

  res.status(200).json({
    success: true,
    order,
    orderQuantity,
  });
});

// ========================== GET MY ALL ORDERS ================================
exports.getMyAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
    orderStatus: {
      $in: [
        "confirmed",
        "processing",
        "shipped",
        "dispatched",
        "out for delivery",
        "delivered",
      ],
    },
  });

  if (!orders) {
    return next(new ErrorHandler("orders not exists", 404));
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

// ========================== ADMIN -- GET TOTAL NUBMER OF ORDERS ================================
exports.getTotalNumberOfOrders = catchAsyncErrors(async (req, res, next) => {
  const totalOrders = await Order.countDocuments({
    orderStatus: { $ne: "pending" },
  });

  res.status(200).json({
    success: true,
    totalOrders,
  });
});

// ========================== ADMIN -- GET ALL ORDERS ================================
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({
    orderStatus: req.params.status.toLowerCase(),
  });

  if (!orders) {
    return next(new ErrorHandler("orders not exists", 404));
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

// ========================== ADMIN -- UPDATE ORDER STATUS ================================
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  const orderStatusCodes = [
    "processing",
    "shipped",
    "dispatched",
    "out for delivery",
    "delivered",
  ];

  const { orderStatus } = req.body;

  if (!order) {
    return next(new ErrorHandler("order not exists", 404));
  }

  if (!orderStatus || orderStatus.toString().trim() === "") {
    return next(new ErrorHandler("order status is required", 400));
  }

  if (!orderStatusCodes.includes(orderStatus)) {
    return next(new ErrorHandler("invalid order status", 400));
  }

  if (orderStatus.toString().toLowerCase() === order.orderStatus) {
    return next(
      new ErrorHandler(
        `order status is already set to '${order.orderStatus.toLowerCase()}'`,
        400
      )
    );
  }

  const orderStatusIndex = orderStatusCodes.indexOf(
    orderStatus.toString().toLowerCase()
  );
  const currentOrderStatusIndex = orderStatusCodes.indexOf(order.orderStatus);

  if (orderStatusIndex < currentOrderStatusIndex) {
    return next(new ErrorHandler("order status cann't be reverted", 400));
  }

  if (orderStatusIndex > currentOrderStatusIndex + 1) {
    return next(
      new ErrorHandler(
        `order status cann't directly set to '${orderStatus
          .toString()
          .toLowerCase()}'`,
        400
      )
    );
  }

  order[orderStatus.toString().toLowerCase()] = Date.now();

  order.orderStatus = orderStatus;
  await order.save({ validateBeforeSave: true });

  if (order.orderStatus === "delivered") {
    const user = await User.findById(order.user);
    const productIds = order.orderItems.map((item) => item.id.toString());
    const mergeIds = [
      ...user.orderedProducts.map((id) => id.toString()),
      ...productIds,
    ];
    user.orderedProducts = [...new Set(mergeIds)];
    await user.save({ validateBeforeSave: true });
  }

  res.status(200).json({
    success: true,
    message: "order status updated",
  });
});

// ========================== DELETE ORDER ================================
exports.deleteOrderAndPaymentOrder = catchAsyncErrors(
  async (req, res, next) => {
    const paymentOrder = await Payment.findOne({
      razorpayOrderId: req.params.id,
    });

    if (!paymentOrder) {
      return next(new ErrorHandler("payment order not exists", 404));
    }

    const order = await Order.findById(paymentOrder.order);

    if (paymentOrder.status === "pending" && order.orderStatus === "pending") {
      await paymentOrder.deleteOne();
      await order.deleteOne();
      res.status(200).json({
        success: true,
      });
    } else {
      return next(
        new ErrorHandler("cann't delete as payment is completed", 400)
      );
    }
  }
);
