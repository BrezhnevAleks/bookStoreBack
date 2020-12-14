const express = require("express");
const authController = require("../controllers/authController.js");

const auth = express.Router();
// const middleware = require("../middleware/tokenAuth.js");

auth.post("/create", authController.createUser);
auth.post("/login", authController.loginUser);
auth.get("/bytoken", authController.getByToken);

module.exports = auth;
