"use strict";
const express = require("express");
var router = express.Router();

const todoList = require("./controllers.js");

const accessPermission = require("./authToken");

router.post("/todo/addtask", accessPermission, todoList.addTask);

router.get("/todo/gettask", accessPermission, todoList.getTaskList);

router.put("/todo/edittask/:id", accessPermission, todoList.editTask);

router.put("/todo/toggletask/:id", accessPermission, todoList.toggleTask);

router.delete("/todo/deletetask/:id", accessPermission, todoList.deleteTask);

module.exports = router;
