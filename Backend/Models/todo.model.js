const mongoose = require("mongoose");
const Todo = new mongoose.Schema(
  {
    completed: { type: Boolean, required: true },
    text: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: Number, required: true },
    userID: { type: String, require: true },
  },
  { collection: "todo" }
);

const model = mongoose.model("TodoData", Todo);

module.exports = model;
