const app = require("../bin/www"); // Adjust the path as needed
const mongoose = require("mongoose");
const request = require("supertest");
const Product = require("../models/productModel");

let adminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzgzY2VlYWMyNTdhZGYyN2JlNzJlOSIsImVtYWlsIjoia2VuMTIzQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNDM5OTUzMX0.a1AGtC29B03XM7W10yGuPwcRVNtWHjfHn_Ybjw9n7MM";

let productId;

beforeAll(async () => {
  await Product.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  app.close();
});

describe("Product Endpoints", () => {
  const sampleProduct = {
    productName: "Heavy-Duty Bagster",
    description:
      "A durable, versatile waste removal bag for heavy-duty projects.",
    price: "29.99",
    stock: 150,
    productCategory: "Bagster",
    productColors: JSON.stringify(["Green", "Black"]),
    dimensions: "8 ft x 4 ft x 2.5 ft",
    capacity: "606 gallons",
    weightLimit: "3300 lbs",
    material: "Polypropylene",
    features: "Tear-resistant, UV-resistant",
    bestUse: "Home renovation projects",
    emptyingMethod: "Crane lifting",
    coverFeatures: "None",
  };

  test("Create a new product", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(sampleProduct);

    console.log("Create Product Response:", response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "productName",
      sampleProduct.productName
    );
    productId = response.body._id;
  });

  test("Get all products", async () => {
    const response = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("Get All Products Response:", response.body);

    expect(response.status).toBe(200);
    expect(response.body.docs).toBeTruthy();
    expect(response.body.docs.length).toBeGreaterThan(0);
  });

  test("Get product by ID", async () => {
    if (!productId) return;

    const response = await request(app)
      .get(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("Get Product by ID Response:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", productId);
    expect(response.body).toHaveProperty(
      "productName",
      sampleProduct.productName
    );
  });

  test("Update product by ID", async () => {
    if (!productId) return;

    const updatedData = {
      price: "34.99",
      stock: 200,
    };

    const response = await request(app)
      .put(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedData);

    console.log("Update Product Response:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("price", updatedData.price);
    expect(response.body).toHaveProperty("stock", updatedData.stock);
  });

  test("Delete product by ID", async () => {
    if (!productId) return;

    const response = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("Delete Product Response:", response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product deleted successfully");
  });

  test("Get products by category", async () => {
    const products = [
      {
        ...sampleProduct,
        productName: "Another Bagster",
        price: "39.99",
      },
      {
        productName: "10-Yard Dumpster",
        description:
          "Ideal for medium-sized cleanouts or small construction projects.",
        price: "349.99",
        stock: 45,
        productCategory: "Dumpster",
        productColors: JSON.stringify(["Blue", "Yellow"]),
        dimensions: "12 ft x 8 ft x 4 ft",
        capacity: "10 cubic yards",
        weightLimit: "2000 lbs",
        material: "Steel",
        features: "Roll-off design, rear door for easy loading",
        bestUse: "Medium renovation projects",
        emptyingMethod: "Roll-off truck",
        coverFeatures: "Tarp cover available",
      },
    ];

    await Product.insertMany(products);

    const response = await request(app)
      .get("/api/products?productCategory=Bagster")
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("Get Products by Category Response:", response.body);

    expect(response.status).toBe(200);
    expect(response.body.docs).toBeTruthy();
    expect(response.body.docs[0].productCategory).toBe("Bagster");
  });
});
