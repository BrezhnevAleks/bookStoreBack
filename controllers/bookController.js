const db = require("../models/index");

exports.getBooks = async (request, response) => {
  try {
    let books;
    const {
      body: { filter, genre },
    } = request;

    let sort = filter === "price" ? "DESC" : "ASC";

    if (genre === "all") {
      books = await db.Book.findAll({ order: [[filter, sort]] });
    } else {
      const searchedGenre = await db.Genre.findOne({ where: { value: genre } });
      const { id } = searchedGenre;
      const books = await db.Book.findAll({
        order: [[filter, sort]],
        include: [
          {
            model: db.Genre,
            as: "genres",
            through: { where: { genreId: id } },
            required: true,
          },
        ],
      });

      response.status(200).send(books);
      return;
    }

    if (books === null) {
      response
        .status(404)
        .send("No data in the database. Books should be added first");
      return;
    }

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

    if (book === null) {
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

    if (book === null) {
      response.srtatus(400).send("Ошибка при загрузке файла");
      return;
    }
    const {
      body: { genre },
    } = request;

    const newGenre = await db.Genre.findOne({ where: { value: genre } });
    book.addGenre(newGenre);

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

    if (book === null) {
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

    if (genres === null) {
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
