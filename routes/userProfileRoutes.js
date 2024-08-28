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
userRouter.get("/", verifyUser, getLoggedInUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Upload Profile Picture
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
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
userRouter.put("/:id", verifyUser, upload.single("picture"), updateProfile);

module.exports = userRouter;
