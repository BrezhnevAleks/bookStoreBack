const express = require("express");

const bookController = require("../controllers/bookController.js");
const upload = require("../middleware/bookCoverUpload.js");
const middleware = require("../middleware/tokenChecking.js");

const book = express.Router();

book.use(middleware.tokenChecking);

book.get("/one", bookController.getOneBook);
book.get("/", bookController.getBooks);
book.post("/newbook", upload.upload, bookController.createBook);
book.patch("/changebook", upload.upload, bookController.changeBook);
book.get("/reviews", bookController.getReviews);
book.get("/getgenres", bookController.getGenres);

module.exports = book;
