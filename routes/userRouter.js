const express = require("express");
const userController = require("../controllers/userController.js");

const userRouter = express.Router();
const middleware = require("../middleware/tokenChecking.js");

userRouter.use(middleware.tokenChecking);

userRouter.post("/addtofavorites", userController.toFavorites);
userRouter.post("/addtoshoplist", userController.toShoplist);

userRouter.post("/addreview", userController.addReview);

module.exports = userRouter;
