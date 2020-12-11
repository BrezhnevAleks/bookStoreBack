const db = require("../models/index");

exports.toFavorites = async (request, response) => {
  try {
    const {
      body: { userId, bookId },
    } = request;

    const favorite = await db.BookUserFavorites.findOne({
      where: {
        userId,
        bookId,
      },
    });

    const user = await db.User.findByPk(userId, {
      include: [
        {
          model: db.Book,
          as: "favorites",
        },
      ],
    });
    const book = await db.Book.findByPk(bookId);
    if (favorite) {
      await user.removeFavorite([book]);
    } else {
      await user.addFavorite([book]);
    }
    const currentUser = await db.User.findByPk(userId, {
      include: [
        {
          model: db.Book,
          as: "favorites",
        },
      ],
    });
    let { favorites } = currentUser;
    favorites = favorites.map((book) => book.toJSON());
    favorites = favorites.map((book) => {
      book.favorite = true;
      return book;
    });
    response.send({ favorites });
  } catch (err) {
    response.status(500).send("Something went terribly wrong");
  }
};

exports.toShoplist = async (request, response) => {
  try {
    const {
      body: { userId, bookId },
    } = request;

    const favorite = await db.BookUserShoplist.findOne({
      where: {
        userId,
        bookId,
      },
    });

    const user = await db.User.findByPk(userId, {
      include: [
        {
          model: db.Book,
          as: "shoplist",
        },
      ],
    });
    const book = await db.Book.findByPk(bookId);
    if (favorite) {
      await user.removeShoplist([book]);
    } else {
      await user.addShoplist([book]);
    }
    const currentUser = await db.User.findByPk(userId, {
      include: [
        {
          model: db.Book,
          as: "shoplist",
        },
      ],
    });
    const { shoplist } = currentUser;
    response.send({ shoplist });
  } catch (err) {
    response.status(500).send("Something went terribly wrong");
  }
};

exports.getFavorites = async (request, response) => {
  try {
    const { id, page, perPage } = request.query;

    const offset = Number(perPage) ? perPage * (page - 1) : null;
    let favorites = await db.Book.findAndCountAll({
      limit: Number(perPage) ? perPage : null,
      offset,
      include: [
        {
          model: db.Genre,
          as: "genres",
        },
        {
          model: db.User,
          as: "users",
          through: { where: { userId: id } },
          required: true,
        },
      ],
    });
    const pageCount = Math.ceil(favorites.count / perPage);
    favorites = favorites.rows.map((book) => book.toJSON());
    favorites = favorites.map((book) => {
      book.favorite = true;
      return book;
    });
    response.send({ favorites, pageCount });
  } catch (err) {
    response.status(500).send("Something went terribly wrong");
  }
};
