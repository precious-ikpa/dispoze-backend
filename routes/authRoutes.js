const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const validatePassword  = require("../middlewares/passwordCheck");

const authRouter = express.Router();

authRouter.post("/register", validatePassword, registerUser);

authRouter.post("/login", loginUser);

authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/reset-password", validatePassword, resetPassword);

module.exports = authRouter;
