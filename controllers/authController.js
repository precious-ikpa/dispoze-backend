const usersModel = require("../models/usersModel");
const userTokenModel = require("../models/userTokenModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/emailUtils");
const { validationResult } = require("express-validator");
const { validatePassword } = require("../middlewares/passwordCheck");

const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, role } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingUser = await usersModel.findOne({ email });

    if (existingUser) {
      res.status(400).send({
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await usersModel.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      role
    });

    res.status(201).send({
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await usersModel.findOne({
      email,
    });

    if (!user) {
      res.status(404).send({
        message: "User not found",
      });
      return;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      res.status(401).send({
        message: "Invalid Credentials",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.AUTH_KEY
    );

    res.status(200).send({
      message: "Login Successfully",
      access_token: token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resetPasswordOtp = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(4, "0");
    const resetPasswordOtpCreatedAt = new Date();

    const user = await usersModel.findOne({ email });

    if (!user) {
      res.send({
        isSuccessful: false,
        message: "User doesn't exist",
      });
      return;
    }

    await userTokenModel.create({
      userId: user._id,
      resetPasswordOtp,
      resetPasswordOtpCreatedAt,
    });

    await sendEmail(
      email,
      "OTP for email verification",
      `Your OTP is ${resetPasswordOtp}. It will expire in 5mins`
    );

    res.status(201).send({
      message: "Reset Password Otp sent",
    });
  } catch (error) {
    next(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { resetPasswordOtp, password, email } = req.body;
    const userTokenCredential = await userTokenModel.findOne({
      resetPasswordOtp,
    });

    if (!userTokenCredential) {
      res.send({
        isSuccessful: false,
        message: "Invalid Otp",
      });
      return;
    }

    const currentTime = new Date();
    const otpExpirationTime = new Date(
      userTokenCredential.resetPasswordOtpCreatedAt
    );
    otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 5);

    if (currentTime > otpExpirationTime) {
      res.status(400).send({
        message: "OTP has expired",
      });
      return;
    }

    const errors = validationResult(req);
    console.log("errors", errors, password);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await usersModel.findById(userTokenCredential.userId);
    const hashedPassword = bcrypt.hashSync(password, 10);

    await usersModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    await userTokenModel.findOneAndDelete({ resetPasswordOtp });

    await sendEmail(
      email,
      "Password Changed",
      "Your Password has been changed"
    );

    res.status(200).send({
      message: "Password Changed",
    });
  } catch (error) {
    next(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
