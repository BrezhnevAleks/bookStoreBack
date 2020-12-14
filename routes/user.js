const express = require("express");
const userController = require("../controllers/userController.js");

const user = express.Router();
const middleware = require("../middleware/tokenAuth.js");

user.use(middleware.tokenAuth);

user.post("/addreview", userController.addReview);
user.patch("/update", userController.updateUser);

module.exports = user;
