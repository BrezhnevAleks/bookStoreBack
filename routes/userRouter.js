const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();
const middleware = require("../middleware/tokenChecking.js");

userRouter.post(
  "/addtofavorites",
  middleware.tokenChecking,
  userController.toFavorites
);
userRouter.post(
  "/addtoshoplist",
  middleware.tokenChecking,
  userController.toShoplist
);

userRouter.post(
  "/addreview",
  middleware.tokenChecking,
  userController.addReview
);

module.exports = userRouter;
