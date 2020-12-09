const express = require("express");

const bookController = require("../controllers/bookController.js");
const upload = require("../middleware/bookCoverUpload.js");
const middleware = require("../middleware/tokenChecking.js");

const bookRouter = express.Router();

bookRouter.post("/one", middleware.tokenChecking, bookController.getOneBook);
bookRouter.get("/", middleware.tokenChecking, bookController.getBooks);
bookRouter.post(
  "/newbook",
  middleware.tokenChecking,
  upload.upload,
  bookController.createBook,
);
bookRouter.post(
  "/changebook",
  middleware.tokenChecking,
  upload.upload,
  bookController.changeBook,
);
bookRouter.post(
  "/reviews",
  middleware.tokenChecking,
  bookController.getReviews,
);
bookRouter.get(
  "/getgenres",
  middleware.tokenChecking,
  bookController.getGenres,
);

module.exports = bookRouter;
