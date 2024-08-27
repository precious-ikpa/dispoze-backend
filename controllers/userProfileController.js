const usersModel = require("../models/usersModel");
const { uploadSingleImageToCloudinary } = require("../utils/helpers");

const getLoggedInUser = async (req, res) => {
  try {
    const user = await usersModel.findById(req.userDetails.id, "-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("updatedta", updateData);

    console.log("file", req.file);
    if (req.file) {
      try {
        const imageUrl = await uploadSingleImageToCloudinary(req.file.path);
        updateData.profilePictureURL = imageUrl;
      } catch (uploadError) {
        return res.status(500).json({ error: "Error uploading image" });
      }
    }

    const updatedUser = await usersModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const userObject = updatedUser.toObject();
    delete userObject.password;

    res.status(200).json(userObject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateProfile,
  getLoggedInUser,
};
