const mongoose = require("mongoose");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
const setupSwaggerDocs = require("./swagger");

var authRouter = require("./routes/authRoutes");
var productRouter = require("./routes/productRoutes");
var userProfileRouter = require("./routes/userProfileRoutes");
var orderRouter = require("./routes/orderRoutes");

var app = express();

mongoose
  .connect(process.env.local_DB)
  .then(() => {
    console.log("Connect to db");
  })
  .catch((error) => {
    console.log("error messsage", error);
  });

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//cloudinary setup
cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
setupSwaggerDocs(app);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userProfileRouter);
app.use("/api/v1/order", orderRouter);

app.get("/", (req, res) => {
  res.send("Welcome to StudyNow backend team!");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).send({
    message: res.locals.error,
  });
});

module.exports = app;
