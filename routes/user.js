const express = require("express");
const userController = require("../controllers/userController.js");

const user = express.Router();
const middleware = require("../middleware/tokenChecking.js");

user.use(middleware.tokenChecking);

user.post("/addreview", userController.addReview);
user.patch("/update", userController.updateUser);

module.exports = user;
