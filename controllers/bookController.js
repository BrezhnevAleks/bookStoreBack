const db = require("../models/index");

exports.getBooks = async (request, response) => {
  try {
    let books;
    const { filter, genre, page, perPage } = request.query;
    const sort = filter === "price" ? "DESC" : "ASC";

    const bookCount = await db.Book.findAndCountAll();
    const pageCount = Math.ceil(bookCount.count / perPage);
    const offset = perPage * (page - 1);

    if (genre === "0") {
      books = await db.Book.findAll({
        limit: perPage,
        offset,
        order: [[filter, sort]],
      });
    } else {
      books = await db.Book.findAll({
        limit: perPage,
        offset,
        order: [[filter, sort]],
        include: [
          {
            model: db.Genre,
            as: "genres",
            through: { where: { genreId: genre } },
            required: true,
          },
        ],
      });
      console.log(books, pageCount);
    }

    if (books) {
      response.status(200).send({ books, pageCount });
      return;
    }
    response
      .status(404)
      .send("No data in the database. Books should be added first");
  } catch (err) {
    console.log("ERR>>>>>>>", err);
    response.status(500).send("Something went terribly wrong");
  }
};

exports.getOneBook = async (request, response) => {
  try {
    const { id } = request.query;
    const searchedValue = { id };
    const book = await db.Book.findOne({
      where: searchedValue,
    });

    if (book) {
      response.status(200).send(book);
      return;
    }
    response
      .status(404)
      .send("No data in the database. Books should be added first");
  } catch (err) {
    response.status(400).send("Something went terribly wrong");
  }
};

exports.createBook = async (request, response) => {
  try {
    const url = `${request.protocol}://${request.get("host")}`;
    const {
      body: { name, author, price, description, genre },
    } = request;
    // eslint-disable-next-line no-prototype-builtins
    const picture = request.hasOwnProperty("file")
      ? `${url}/${request.file.filename}`
      : "picture";

    const book = await db.Book.create({
      name,
      author,
      price,
      description,
      picture,
    });

    if (book) {
      const newGenre = await db.Genre.findOne({ where: { value: genre } });
      book.addGenre(newGenre);

      response.send(book);
      return;
    }
    response.status(400).send("Ошибка при загрузке файла");
  } catch (err) {
    response.status(400).send("Something went terribly wrong");
  }
};

exports.getReviews = async (request, response) => {
  try {
    const { bookId } = request.query;
    const allReviews = await db.Review.findAll({
      where: { bookId },
      include: {
        model: db.User,
        as: "user",
        attributes: ["login"],
      },
    });
    const rated = allReviews.filter((item) => item.rating != null);
    let rate = null;

    if (rated.length) {
      rate = (
        rated.reduce((acc, item) => Number(acc) + item.rating, 0) / rated.length
      ).toFixed(2);
    }

    const reviews = allReviews.filter((item) => item.text);

    response.send({ reviews, rate });
  } catch (err) {
    console.log(err);
    response.status(400).send("Something went terribly wrong");
  }
};

exports.changeBook = async (request, response) => {
  try {
    const {
      protocol,
      body: { id, name, author, price, description },
    } = request;
    const url = `${protocol}://${request.get("host")}`;
    const searchedValue = { id };
    const book = await db.Book.findOne({ where: searchedValue });

    if (book) {
      // eslint-disable-next-line no-prototype-builtins
      const picture = request.hasOwnProperty("file")
        ? `${url}/${request.file.filename}`
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
      return;
    }
    response.status(404).send("Book not found");
  } catch (err) {
    response.status(400).send("Something went terribly wrong");
  }
};

exports.getGenres = async (request, response) => {
  try {
    const genres = await db.Genre.findAll({ raw: true });

    if (genres) {
      response.status(200).send(genres);
      return;
    }
    response
      .status(404)
      .send("No data in the database. Genres should be added first");
  } catch (err) {
    response.status(400).send("Something went terribly wrong");
  }
};
