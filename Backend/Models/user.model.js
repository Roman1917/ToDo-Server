const mongoose = require("mongoose");
const User = new mongoose.Schema(
  {
    login: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userID: { type: String, required: true },
    accessToken: { type: String },
    refreshToken: { type: String },
  },
  { collection: "user" }
);

const model = mongoose.model("UserData", User);

module.exports = model;
