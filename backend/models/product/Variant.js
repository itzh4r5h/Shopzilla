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
    price: { type: Number, required: true, index: true },
    stock: { type: Number, default: 0, index: true },
    sku: { type: String, unique: true }, // Stock Keeping Unit
    attributes: [productAttributeSchema], // e.g. RAM=16GB, Storage=256GB
    images: [
      {
        color: {
          type: String,
         required: [true, "color is required"],
         default: 'default'
        },
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
      default: false
    }
  },
  { timestamps: true }
);

variantSchema.index({ "attributes.name": 1, "attributes.value": 1 });
variantSchema.index({ product: 1, price: 1 });

const Variant = mongoose.model("Variant", variantSchema);

module.exports = { Variant };
