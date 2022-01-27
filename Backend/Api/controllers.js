"use strict";
const mongoose = require("mongoose");

const User = require("../Models/user.model.js");
const Todo = require("../Models/todo.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = "secret123";

exports.taskRegistration = async function (req, res) {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 6);

    const user = await User.create({
      login: req.body.login,
      email: req.body.email,
      password: hashPassword,
      userID: req.body.userID,
    });

    return res.json({ status: "ok", user: true });
  } catch (err) {
    return res.json({ status: "error", error: "Duplicate email", user: false });
  }
};

exports.taskLogin = async function (req, res) {
  try {
    const email = req.body.email;
    const user = await User.findOne({
      email: req.body.email,
    });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (user && validPassword) {
      const accessToken = jwt.sign(
        {
          userID: req.body.userID,
          login: req.body.login,
          email: req.body.email,
        },
        secretKey,
        { expiresIn: "30m" }
      );
      const refreshToken = jwt.sign(
        {
          userID: req.body.userID,
        },
        secretKey,
        { expiresIn: "500m" }
      );
      const id = user._id;

      await User.findByIdAndUpdate(id, {
        accessToken: accessToken,
      });
      await User.findByIdAndUpdate(
        id,

        { refreshToken: refreshToken }
      );

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      return res.json({
        status: 1,
        user: user,
      });
    } else {
      return res.json({ status: "error", user: false });
    }
  } catch (err) {
    console.log("🚀 ~ file: controllers.js ~ line 72 ~ err", err);
  }
};

exports.refreshTokens = async function (req, res) {
  const refToken = req.headers["refresh-token"];

  if (!refToken) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(refToken, "secret123");
    console.log(1);
    if (decoded) {
      const user = await User.findOne({ refreshToken: refToken });

      const accessToken = jwt.sign(
        {
          userID: req.body.userID,
          login: req.body.login,
          email: req.body.email,
        },
        secretKey,
        { expiresIn: "30m" }
      );
      const refreshToken = jwt.sign(
        {
          userID: req.body.userID,
        },
        secretKey,
        { expiresIn: "500m" }
      );

      const id = user._id;

      await User.findByIdAndUpdate(id, {
        accessToken: accessToken,
      });

      await User.findByIdAndUpdate(id, {
        refreshToken: refreshToken,
      });
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      return res.json({ user: user });
    } else return res.status(401).send("Not verified Refresh Token");
  } catch (err) {
    return res.status(401).send("Invalid Refresh Token");
  }

  return next();
};

exports.getUser = async function (req, res) {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email });
    return res.json({ user: user });
  } catch (err) {
    console.log("🚀 ~ file: controllers.js ~ line 56 ~ err", err);
  }
};

exports.addTask = async function (req, res) {
  try {
    const newTodo = await Todo.create({
      completed: req.body.completed,
      text: req.body.text,
      time: req.body.time,
      status: 1,
      userID: req.body.userID,
    });

    return res.json({ todo: newTodo });
  } catch (err) {
    console.log("🚀 ~ file: server.mjs ~ line 58 ~ app.post ~ err", err);
    return res.json({ status: "error", error: "Todo not added", todo: false });
  }
};

exports.getTaskList = async function (req, res) {
  try {
    const getTodo = await Todo.find();
    return res.json({ todo: getTodo });
  } catch (err) {
    console.log("🚀 ~ file: server.mjs ~ line 58 ~ app.post ~ err", err);
  }
};

exports.editTask = async function (req, res) {
  const id = req.params.id;
  const updatedTodo = req.body.text;

  try {
    const editTodo = await Todo.findByIdAndUpdate(id, { text: updatedTodo });
    return res.json({ todo: editTodo });
  } catch (err) {
    console.log("🚀 ~ file: server.mjs ~ line 92 ~ app.delete ~ e", err);
  }
};

exports.toggleTask = async function (req, res) {
  const id = req.params.id;
  const updatedTodo = req.body.completed;

  try {
    const toggleTodo = await Todo.findByIdAndUpdate(id, {
      $set: {
        completed: !updatedTodo,
        status: Number(!updatedTodo + 1),
      },
    });
    return res.json({ todo: toggleTodo });
  } catch (err) {
    console.log("🚀 ~ file: server.mjs ~ line 92 ~ app.delete ~ e", err);
  }
};

exports.deleteTask = async function (req, res) {
  const id = req.params.id;

  try {
    const deleteTodo = await Todo.findByIdAndUpdate(id, {
      $set: {
        status: 3,
      },
    });
    return res.json({ status: 3, todo: deleteTodo });
  } catch (err) {
    console.log("🚀 ~ file: server.mjs ~ line 92 ~ app.delete ~ e", err);
  }
};
