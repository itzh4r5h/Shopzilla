const mongoose = require("mongoose");

// Attribute schema for each variant
const productAttributeSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true }, // e.g. "RAM"
  value: { type: mongoose.Schema.Types.Mixed, index: true }, // e.g. "16GB", 512, true
});

// Variant schema (specific purchasable version of a product)
const variantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    sku: { type: String, unique: true },
    attributes: [productAttributeSchema],
    needSize: {
      type: Boolean,
      required: [true, "need size is required"],
    },
    images: [
      {
        color: {
          type: String,
          required: [true, "color is required"],
        },
        price: { type: Number, required: [true, "price is required"] },
        stock: {
          type: Number,
          validate: {
            validator: function (value) {
               const variant = this.ownerDocument(); // top-level variant document
              if (
                !variant.needSize &&
                (value === null || value === undefined)
              ) {
                return false; // stock is required when needSize is false
              }
              return true; // stock is optional when needSize is true
            },
            message: "stock is required when needSize is false",
          },
        },
        sizes: [
          {
            size: { type: String, required: true },
            stock: { type: Number, default: 1 },
          },
        ],
        files: [
          {
            url: {
              type: String,
              required: [true, "image url is required"],
            },
            fileId: {
              type: String,
              required: [true, "image file-id is required"],
            },
            name: {
              type: String,
              required: [true, "image name is required"],
            },
          },
        ],
      },
    ],
    imagesUploaded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

variantSchema.index({ "attributes.name": 1, "attributes.value": 1 });
variantSchema.index({ "images.price": 1 });
variantSchema.index({ product: 1, "images.price": 1 });
variantSchema.index({ imagesUploaded: 1 });

const Variant = mongoose.model("Variant", variantSchema);

module.exports = { Variant };
