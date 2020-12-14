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

    response.send("Success");
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

    response.send("Success");
  } catch (err) {
    response.status(500).send("Something went wrong");
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
        {
          model: db.User,
          as: "buyers",
          through: { where: { userId: id } },
        },
      ],
    });

    const pageCount = Math.ceil(favorites.count / perPage);

    const { rows, count } = favorites;

    favorites = rows.map((book) => book.toJSON());
    favorites = favorites.map((book) => {
      book.favorite = true;
      book.inShopList = !!book.buyers[0];
      delete book.buyers;
      delete book.users;
      return book;
    });

    response.send({ favorites, pageCount, favoritesCount: count });
  } catch (err) {
    response.status(500).send("Something went wrong");
  }
};

exports.getShoplist = async (request, response) => {
  try {
    const { id, page, perPage } = request.query;

    const offset = Number(perPage) ? perPage * (page - 1) : null;
    let shoplist = await db.Book.findAndCountAll({
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
        },
        {
          model: db.User,
          as: "buyers",
          through: { where: { userId: id } },
          required: true,
        },
      ],
    });
    const pageCount = Math.ceil(shoplist.count / perPage);

    const { rows, count } = shoplist;

    shoplist = rows.map((book) => book.toJSON());
    shoplist = shoplist.map((book) => {
      book.inShopList = true;
      book.favorite = !!book.users[0];
      delete book.buyers;
      delete book.users;
      return book;
    });

    response.send({ shoplist, pageCount, shoplistCount: count });
  } catch (err) {
    response.status(500).send("Something went wrong");
  }
};
