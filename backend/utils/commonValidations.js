const ErrorHandler = require("./errorHandler");
const { isOnlyDigits } = require("./helpers");


const validateQuantityAndStock = (req,variant,next)=>{
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

    return {quantity,colorIndex,sizeIndex}
}


module.exports = {validateQuantityAndStock}