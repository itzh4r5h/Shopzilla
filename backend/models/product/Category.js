const mongoose = require("mongoose");
const ErrorHandler = require("../../utils/errorHandler");

// Attribute Definition Schema
const attributeDefinitionSchema = new mongoose.Schema({
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
  },
});

// Subcategory Schema
const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "subcategory name is required"],
    index: true,
    trim: true,
    minlength: [2, "subcategory name must be at least 2 characters long"],
    maxlength: [50, "subcategory name must not exceed 50 characters"],
  },
  attributes: [attributeDefinitionSchema],
});

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

categorySchema.pre("save", function (next) {
  // --- check duplicate subcategory ---
  const names = this.subcategories.map((subcategory) =>
    subcategory.name.toLowerCase()
  );
  const seen = new Set();
  const duplicates = [];

  for (const name of names) {
    if (seen.has(name)) {
      duplicates.push(name);
    } else {
      seen.add(name);
    }
  }

  if (duplicates.length > 0) {
    return next(
      new ErrorHandler(`${[...new Set(duplicates)].join(", ")} already exists`)
    );
  }

  // --- check duplicate attributes inside each subcategory ---
  for (const sub of this.subcategories) {
    if (sub.attributes && sub.attributes.length > 0) {
      const attrNames = sub.attributes.map((attr) =>
        attr.name.trim().toLowerCase()
      );
      const seenAttr = new Set();
      const duplicateAttrs = [];

      for (const attr of attrNames) {
        if (seenAttr.has(attr)) {
          duplicateAttrs.push(attr);
        } else {
          seenAttr.add(attr);
        }
      }

      if (duplicateAttrs.length > 0) {
        return next(
          new ErrorHandler(
            `${[...new Set(duplicateAttrs)].join(", ")} already exists`
          )
        );
      }
    }
  }
  next();
});

// Compound index: subcategory names must be unique within category
// categorySchema.index({ name: 1, "subcategories.name": 1 });

// Compound index: attribute names must be unique within each subcategory
// categorySchema.index(
//   { name: 1, "subcategories.name": 1, "subcategories.attributes.name": 1 }
// );

const Category = mongoose.model("Category", categorySchema);

module.exports = { Category };
