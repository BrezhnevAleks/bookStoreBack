const express = require("express");
const booklistsController = require("../controllers/booklistsController.js");

const booklists = express.Router();
const middleware = require("../middleware/tokenChecking.js");

booklists.use(middleware.tokenChecking);

booklists.post("/addtofavorites", booklistsController.toFavorites);
booklists.post("/addtoshoplist", booklistsController.toShoplist);
booklists.get("/getfavorites", booklistsController.getFavorites);

module.exports = booklists;
