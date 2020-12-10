const express = require("express");
const authController = require("../controllers/authController.js");

const auth = express.Router();
const middleware = require("../middleware/tokenChecking.js");

auth.post("/create", authController.createUser);
auth.post("/login", authController.loginUser);
auth.get("/bytoken", middleware.tokenChecking, authController.getByToken);
module.exports = auth;
