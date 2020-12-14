const express = require("express");
const booklistsController = require("../controllers/booklistsController.js");

const booklists = express.Router();
const middleware = require("../middleware/tokenAuth.js");

booklists.use(middleware.tokenAuth);

booklists.post("/addtofavorites", booklistsController.toFavorites);
booklists.post("/addtoshoplist", booklistsController.toShoplist);
booklists.get("/getfavorites", booklistsController.getFavorites);
booklists.get("/getshoplist", booklistsController.getShoplist);

module.exports = booklists;
