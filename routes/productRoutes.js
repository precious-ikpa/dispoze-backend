const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const verifyUser = require("../middlewares/verifyUser");
const roleCheck = require("../middlewares/roleCheck");
const { upload } = require("../utils/multerConfig");

const productRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Profile management
 */

// Search and get all products with pagination
productRouter.get("/", getProducts);

// Get a product by ID
productRouter.get("/:id", verifyUser, getProductById);

// Create a new product (only accessible to admins)
productRouter.post(
  "/",
  verifyUser,
  roleCheck(["admin"]),
  upload.array("productImages", 5),
  createProduct
);

// Update a product by ID (only accessible to admins)
productRouter.put(
  "/:id",
  verifyUser,
  roleCheck(["admin"]),
  upload.array("productImages", 5),
  updateProduct
);

// Delete a product by ID (only accessible to admins)
productRouter.delete("/:id", verifyUser, roleCheck(["admin"]), deleteProduct);

module.exports = productRouter;
