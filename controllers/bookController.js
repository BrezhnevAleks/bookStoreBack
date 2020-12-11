const db = require("../models/index");

exports.getBooks = async (request, response) => {
  try {
    const { id, filter, genre, page, perPage } = request.query;

    const sort = filter === "price" ? "DESC" : "ASC";
    const bookCount = await db.Book.findAndCountAll();
    const pageCount = Math.ceil(bookCount.count / perPage);
    const offset = perPage * (page - 1);

    const hasGenre = genre === "0" ? null : { genreId: genre };

    let books = await db.Book.findAll({
      limit: perPage,
      offset,
      order: [[filter, sort]],

      include: [
        {
          model: db.Genre,
          as: "genres",
          through: { where: hasGenre },
          required: !!hasGenre,
        },
        {
          model: db.User,
          as: "users",
          through: { where: { userId: id } },
          attributes: ["id"],
        },
      ],
    });
    books = books.map((book) => book.toJSON());
    books = books.map((book) => {
      book.favorite = !!book.users[0];
      delete book.users;
      return book;
    });
    response.send({ books, pageCount, bookCount: bookCount.count });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    response.status(500).send("Something went terribly wrong");
  }
};

exports.getOneBook = async (request, response) => {
  try {
    const { id } = request.query;

    const book = await db.Book.findByPk(id);

    response.send(book);
  } catch (err) {
    response.status(500).send("Something went terribly wrong");
  }
};

exports.createBook = async (request, response) => {
  try {
    const { protocol,
      body: { name, author, price, description, genre },
    } = request;
    const url = `${protocol}://${request.get("host")}`;

    const picture = Object.prototype.hasOwnProperty.call(request, "file")
      ? `${url}/${request.file.filename}`
      : "picture";

    const book = await db.Book.create({
      name,
      author,
      price,
      description,
      picture,
    });

    const selectedGenre = await db.Genre.findByPk(genre);

    book.addGenre(selectedGenre);

    response.send(book);
  } catch (err) {
    response.status(500).send("Something went terribly wrong");
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
    response.status(500).send("Something went terribly wrong");
  }
};

exports.changeBook = async (request, response) => {
  try {
    const {
      protocol,
      body: { id, name, author, price, description },
    } = request;
    const url = `${protocol}://${request.get("host")}`;
    const book = await db.Book.findByPk(50);

    const picture = Object.prototype.hasOwnProperty.call(request, "file")
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
      },
    );

    response.send(book);
  } catch (err) {
    response.status(500).send("Something went terribly wrong");
  }
};

exports.getGenres = async (request, response) => {
  try {
    const genres = await db.Genre.findAll({ raw: true });

    response.send(genres);
  } catch (err) {
    response.status(500).send("Something went terribly wrong");
  }
};
