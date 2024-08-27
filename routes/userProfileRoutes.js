const express = require("express");
const {
  getLoggedInUser,
  updateProfile,
} = require("../controllers/userProfileController");

const verifyUser = require("../middlewares/verifyUser");
const roleCheck = require("../middlewares/roleCheck");
const { upload } = require("../utils/multerConfig");

const userRouter = express.Router();

userRouter.get("/", verifyUser, getLoggedInUser);

userRouter.put(
  "/:id",
  verifyUser,
  upload.single('picture'),
  updateProfile
);

module.exports = userRouter;
