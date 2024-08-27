const { order } = require("../models/orderModel");
const productModel = require("../models/productModel");

const deleteItem = async (req, res, next) => {
  const { orderId, itemId } = req.params;
  try {
    const orderDoc = await order.findById(orderId);
    if (!orderDoc) {
      return res.status(404).send({ message: "Order not found" });
    }

    const itemIndex = orderDoc.orderItems.findIndex(
      (item) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      return res.status(404).send({ message: "Item not found in order" });
    }

    orderDoc.orderItems.splice(itemIndex, 1);

    orderDoc.totalCost = orderDoc.orderItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    await orderDoc.save();

    res
      .status(200)
      .send({ message: "Item removed successfully", order: orderDoc });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { orderItems } = req.body;
    const customerId = req.userDetails.id;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).send({ message: "Invalid order data" });
    }

    try {
      let totalOrderCost = 0;
      const items = [];

      for (const item of orderItems) {
        const product = await productModel.findById(item.productId);
        if (!product) {
          res
            .status(404)
            .send({ message: `Product not found: ${item.productId}` });
        }

        //checks if the stock is enough for the order
        if (product.stock < item.quantity) {
          res.status(400).send({
            message: `Insufficient stock for product: ${product.productName}`,
          });
          return;
        }

        //calculate the total cost for this product
        const totalCost = product.price * item.quantity;

        totalOrderCost += totalCost;

        items.push({
          productId: product._id,
          quantity: item.quantity,
          price: product.price,
          totalCost,
        });
      }

      for (const item of items) {
        const product = await productModel.findById(item.productId);
        product.stock -= item.quantity;
        await product.save();
      }

      //create the order
      const newOrder = await order.create({
        customerId,
        orderItems: items,
        totalCost: totalOrderCost,
      });

      res.status(201).send({
        message: "Order created successfully",
        order: newOrder,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

module.exports = {
  addItem,
  deleteItem,
};
