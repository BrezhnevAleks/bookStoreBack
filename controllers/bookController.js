const db = require("../models/index");
const utils = require("../utils.js");

exports.getBooks = async (request, response) => {
  try {
    let books;
    const {
      body: { filter, genre },
    } = request;

    if (genre === "all") {
      books = await db.Book.findAll({ raw: true });
    } else {
      let genres = await db.Genre.findOne({ where: { value: genre } });
      books = await db.Book.findAll({ where: { id: genres.booksId } });
    }

    if (!books) {
      response
        .status(404)
        .send("No data in the database. Books should be added first");
      return;
    }

    utils.sortingType(books, filter);
    response.status(200).send(books);
  } catch (err) {
    response.status(400).send("Something went terribly wrong");
  }
};

exports.getOneBook = async (request, response) => {
  try {
    const {
      body: { id },
    } = request;
    const searchedValue = { id };
    const book = await db.Book.findOne({
      where: searchedValue,
    });

    if (!book) {
      response
        .status(404)
        .send("No data in the database. Books should be added first");
      return;
    }

    response.status(200).send(book);
  } catch (err) {
    response.status(400).send("Something went terribly wrong");
  }
};

exports.createBook = async (request, response) => {
  try {
    const url = request.protocol + "://" + request.get("host");
    const {
      body: { name, author, price, description },
    } = request;
    const picture = request.hasOwnProperty("file")
      ? url + "/" + request.file.filename
      : "picture";

    const book = await db.Book.create({
      name,
      author,
      price,
      description,
      picture,
    });

    if (!book) {
      response.srtatus(400).send("Ошибка при загрузке файла");
      return;
    }
    const {
      body: { genre },
    } = request;

    const newGenre = await db.Genre.findOne({ where: { value: genre } });

    if (newGenre) {
      await newGenre.update(
        {
          booksId: [...newGenre.booksId, book.id],
        },
        {
          where: {
            value: genre,
          },
        }
      );
    } else {
      await db.Genre.create({
        genre,
        booksId: [book.id],
      });
    }
    response.send(book);
  } catch (err) {
    response.status(400).send("Something went terribly wrong");
  }
};

exports.getReviews = async (request, response) => {
  try {
    const {
      body: { bookId },
    } = request;
    let allReviews = await db.Review.findAll({
      where: { bookId },
      include: {
        model: db.User,
        as: "user",
        attributes: ["login"],
      },
    });
    let rated = allReviews.filter((item) => item.rating != null);
    let rate = null;

    if (rated.length) {
      rate = (
        rated.reduce((acc, item) => Number(acc) + item.rating, 0) / rated.length
      ).toFixed(2);
    }

    const reviews = allReviews.filter((item) => item.text);

    response.send({ reviews, rate });
  } catch (err) {
    response.status(400).send("Something went terribly wrong");
  }
};

exports.changeBook = async (request, response) => {
  try {
    const {
      protocol,
      body: { id, name, author, price, description },
    } = request;
    const url = protocol + "://" + request.get("host");
    const searchedValue = { id };
    const book = await db.Book.findOne({ where: searchedValue });

    if (!book) {
      response.status(404).send(`Book not found`);
      return;
    }
    const picture = request.hasOwnProperty("file")
      ? url + "/" + request.file.filename
      : book.picture;

    await db.Book.update(
      {
        name,
        author,
        price,
        description,
        picture,
      },
      {
        where: { id },
      }
    );

    response.send(book);
  } catch (err) {
    response.status(400).send("Something went terribly wrong");
  }
};

exports.getGenres = async (request, response) => {
  try {
    let genres = await db.Genre.findAll({ raw: true });

    if (!genres) {
      response
        .status(404)
        .send("No data in the database. Genres should be added first");
      return;
    }

    response.status(200).send(genres);
  } catch (err) {
    response.status(400).send("Something went terribly wrong");
  }
};
