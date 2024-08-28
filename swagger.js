const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0", // You can also use Swagger 2.0
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "This is the API documentation for ecommerce project",
    },
    servers: [
      {
        url: "https://dispoze-backend.onrender.com/",
        description: "Production server",
      },
      {
        url: "http://localhost:3000/",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your API routes or controllers
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwaggerDocs = (app) => {
  // Route to serve the Swagger docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(
    "Swagger docs available at https://dispoze-backend.onrender.com/api-docs"
  );
};

module.exports = setupSwaggerDocs;
