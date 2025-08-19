const mongoose = require("mongoose")

// Attribute Definition Schema
const attributeDefinitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "attribute name is required"],
      trim: true,
      minlength: [2, "attribute name must be at least 2 characters long"],
      maxlength: [50, "attribute name must not exceed 50 characters"],
    },
    type: {
      type: String,
      required: [true, "attribute type is required"],
      enum: {
        values: ["string", "number", "boolean", "enum"],
        message: "attribute type must be string, number, boolean or enum",
      },
    },
    required: {
      type: Boolean,
      default: true,
    }
  },
);

// Subcategory Schema
const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "subcategory name is required"],
      index: true,
      trim: true,
      minlength: [2, "subcategory name must be at least 2 characters long"],
      maxlength: [50, "subcategory name must not exceed 50 characters"],
    },
    attributes: [attributeDefinitionSchema],
  }
);

// Main Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
      unique: true,
      index: true,
      trim: true,
      minlength: [2, "category name must be at least 2 characters long"],
      maxlength: [50, "category name must not exceed 50 characters"],
    },
    subcategories: [subcategorySchema],
  },
  { timestamps: true }
);

// Compound index: subcategory names must be unique within category
categorySchema.index({ name: 1, "subcategories.name": 1 }, { unique: true });

// Compound index: attribute names must be unique within each subcategory
categorySchema.index(
  { name: 1, "subcategories.name": 1, "subcategories.attributes.name": 1 },
  { unique: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = { Category };
