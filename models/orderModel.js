// const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate-v2");

// const orderItemSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   productName: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     default: 1,
//   },
//   totalCost: {
//     type: Number,
//   },
// });

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//       required: true,
//     },
//     orderItems: [orderItemSchema],
//     totalCost: {
//       type: Number,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// orderSchema.plugin(mongoosePaginate);

// const order = model("order", orderSchema);
// const orderItem = model("orderItem", orderItemSchema);

// module.exports = {
//   order,
//   orderItem,
// };

const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const orderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
  },
});

const orderSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    orderItems: [orderItemSchema],
    totalCost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
orderSchema.plugin(mongoosePaginate);

const order = model("order", orderSchema);
const orderItem = model("orderItem", orderItemSchema);

module.exports = {
  order,
  orderItem,
};
