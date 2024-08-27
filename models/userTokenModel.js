const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    resetPasswordOtp: {
      type: String,
      required: true,
    },
    resetPasswordOtpCreatedAt: {
      type: Date,
      required: true,
    },
    authPurpose: {
      type: String,
    },
  },
  { timestamps: true }
);

const userTokenModel = mongoose.model("userToken", userTokenSchema);

module.exports = userTokenModel;
