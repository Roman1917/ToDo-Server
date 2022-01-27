"use strict";
const express = require("express");
var router = express.Router();

const todoList = require("./controllers.js");

router.post("/login", todoList.taskLogin);

router.post("/registration", todoList.taskRegistration);

router.post("/refreshToken", todoList.refreshTokens);

module.exports = router;
