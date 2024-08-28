const usersModel = require("../models/usersModel");
const { uploadSingleImageToCloudinary } = require("../utils/helpers");

const getLoggedInUser = async (req, res) => {
  try {
    const user = await usersModel.findById(req.userDetails.id, "-password");
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const file = req.file.path;

    console.log("updatedta", updateData);

    console.log("file", file);
    if (file) {
      try {
        const imageUrl = await uploadSingleImageToCloudinary(file);
        updateData.profilePictureURL = imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).send({ error: "Error uploading image" });
      }
    }

    const updatedUser = await usersModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send({ error: "User not found" });
    }

    const userObject = updatedUser.toObject();
    delete userObject.password;

    res.status(200).json(userObject);
  } catch (error) {
    console.error("Error updating profile:", error);
    next(error);
    // res.status(500).send({ error: error.message });
  }
};

module.exports = {
  updateProfile,
  getLoggedInUser,
};
