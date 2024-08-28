const express = require("express");
const {
  getLoggedInUser,
  updateProfile,
} = require("../controllers/userProfileController");

const verifyUser = require("../middlewares/verifyUser");
const roleCheck = require("../middlewares/roleCheck");
const { upload } = require("../utils/multerConfig");

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Profile management
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get Profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 */

userRouter.get("/", verifyUser, getLoggedInUser);

/**
 * @swagger
 * /api/v1/users:
 *   put:
 *     summary: Upload Profile Picture
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
userRouter.put("/", verifyUser, upload.single("picture"), updateProfile);

module.exports = userRouter;
