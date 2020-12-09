const express = require("express");
const crudController = require("../controllers/crudController.js");

const crudRouter = express.Router();
const middleware = require("../middleware/tokenChecking.js");

crudRouter.post("/create", crudController.createUser);
crudRouter.post("/login", crudController.loginUser);
crudRouter.post("/update", middleware.tokenChecking, crudController.updateUser);
crudRouter.get("/bytoken", middleware.tokenChecking, crudController.getByToken);
module.exports = crudRouter;
