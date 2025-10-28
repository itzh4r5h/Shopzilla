const ErrorHandler = require("./errorHandler");
const { isOnlyDigits } = require("./helpers");


const validateQuantityAndStock = (req,variant)=>{
    const { quantity, colorIndex, sizeIndex } = req.body;

    if (typeof colorIndex !== "number" && !colorIndex) {
      return "color is required"
    }

    if (!quantity || quantity.toString().trim() === "") {
      return next(new ErrorHandler("quantity is required", 400));
    }

    if (!isOnlyDigits(quantity)) {
      return "quantity must be a number"
    }

    // if need size is true
    if (variant.needSize) {
      if (typeof sizeIndex !== "number" && !sizeIndex) {
        return "size is required"
      }

      if (
        Number(quantity) > variant.images[colorIndex].sizes[sizeIndex].stock ||
        variant.images[colorIndex].sizes[sizeIndex].stock === 0
      ) {
        return "oops! not enough stock"
      }
    } else {
      if (
        Number(quantity) > variant.images[colorIndex].stock ||
        variant.images[colorIndex].stock === 0
      ) {
        return "oops! not enough stock"
      }
    }
    return false
}


module.exports = {validateQuantityAndStock}