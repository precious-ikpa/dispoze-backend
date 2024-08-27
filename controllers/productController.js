const Product = require("../models/productModel");
const { uploadMultipleImagesToCloudinary } = require("../utils/helpers");

const createProduct = async (req, res) => {
  let productImages = [];

  try {
    const {
      productName,
      description,
      price,
      stock,
      productCategory,
      productColors,
      dimensions,
      capacity,
      weightLimit,
      material,
      features,
      bestUse,
      emptyingMethod,
      coverFeatures,
    } = req.body;

    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
      console.log("Product already exists:", productName);
      return res
        .status(400)
        .json({ error: "A product with this name already exists." });
    }

    try {
      // Upload images to Cloudinary

      if (req.files && req.files.length > 0) {
        productImages = await uploadMultipleImagesToCloudinary(req.files);
      }
    } catch (uploadError) {
      return res
        .status(500)
        .json({ error: "Image upload failed", details: uploadError.message });
    }

    const newProduct = new Product({
      productName,
      description,
      price,
      stock,
      productCategory,
      productColors,
      dimensions,
      capacity,
      weightLimit,
      material,
      features,
      bestUse,
      emptyingMethod,
      coverFeatures,
      productImages,
    });

    const savedProduct = await newProduct.save();
    console.log("Product saved successfully:", savedProduct);
    return res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Unexpected error in createProduct:", error);

    const errorMessage = error.message || "An unknown error occurred";
    return res.status(500).json({ error: errorMessage });
  }
};

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, productName, productCategory } = req.query;

    // Build search criteria based on query parameters
    const searchCriteria = {};

    if (productName) {
      searchCriteria.productName = { $regex: productName, $options: "i" };
    }

    if (productCategory) {
      searchCriteria.productCategory = productCategory;
    }

    // Fetch products based on search criteria and pagination
    const products = await Product.paginate(searchCriteria, { page, limit });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const updateData = req.body;

    if (req.files && req.files.length > 0) {
      updateData.productImages = await uploadMultipleImagesToCloudinary(
        req.files
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
