const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    productCategory: {
      type: String,
      enum: ["Bagster", "Container", "Dumpster"],
      required: true,
    },
    productColors: {
      type: [String],
      default: [],
    },
    productImages: {
      type: [String],
      default: [],
    },
    dimensions: {
      type: String,
    },
    capacity: {
      type: String,
    },
    weightLimit: {
      type: String,
    },
    material: {
      type: String,
    },
    features: {
      type: String,
    },
    bestUse: {
      type: String,
    },
    emptyingMethod: {
      type: String,
    },
    coverFeatures: {
      type: String,
    },
  },
  { timestamps: true }
);

productSchema.plugin(mongoosePaginate);

module.exports = model("Product", productSchema);
