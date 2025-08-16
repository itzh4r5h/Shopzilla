const mongoose = require("mongoose");

const attributeDefinitionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "ram", "size", "color"
  type: {
    type: String,
    enum: ["string", "number", "boolean", "enum"],
    required: true,
  },
  required: { type: Boolean, default: false },
  options: [String], // only for enum types, e.g. ["S","M","L","XL"]
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "laptop"
  attributes: [attributeDefinitionSchema],
});

const Category = mongoose.model("Category", categorySchema);

module.exports = { Category };
