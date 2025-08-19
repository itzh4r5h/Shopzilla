const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";

  // invalid mongodb id
  if (err.name === "CastError") {
    err = new ErrorHandler(
      `Resource not found due to invalid ${err.path}`,
      400
    );
  } else if (err.name === "TypeError" && err.message.includes("destructure")) {
    err = new ErrorHandler("data not received", 400);
  }

  // mongodb duplicate key error
  else if (err.code === 11000) {
    err = new ErrorHandler(`${Object.values(err)[1]["keyValue"][Object.keys(err.keyValue)]} already exists`, 400);
  }

  // Wrong JWT Token
  else if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid JWT Token", 400);
  }

  // Expired JWT Token
  else if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JWT Token has expired", 400);
  }

  // mongodb validation error
  else if (err.name === "ValidationError") {
    // Get the first error object
    const firstError = Object.values(err.errors)[0];
    const message = firstError.message;
    err = new ErrorHandler(message, 400);
  }

  // multer file exceed limit error
  else if (err.code === "LIMIT_FILE_SIZE") {
    err = new ErrorHandler(
      `File size should not exceed ${process.env.IMAGE_MAX_SIZE_IN_MB} MB`,
      400
    );
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
