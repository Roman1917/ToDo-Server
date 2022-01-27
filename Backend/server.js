const express = require("express");
const cors = require("cors");
const port = 3012;

const app = express();
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());
const bodyParser = require("body-parser");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/LoginSystem");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const auth = require("./Api/auth");
const todo = require("./Api/todo");

app.use("/auth", auth);

app.use("/todo", todo);

app.listen(port, () => {
  console.log("Server started");
});
