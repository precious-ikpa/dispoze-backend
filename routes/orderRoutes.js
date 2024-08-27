const express = require("express");

const { addItem, deleteItem } = require("../controllers/orderController");
const verifyUser = require("../middlewares/verifyUser");
const roleCheck = require("../middlewares/roleCheck");

const orderRouter = express.Router();

orderRouter.post("/addItem", verifyUser, addItem);
orderRouter.delete("/deleteItem/:orderId/:itemId", verifyUser, deleteItem);
module.exports = orderRouter;
