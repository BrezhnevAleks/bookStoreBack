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

    if (favorite) {
      const user = await db.User.findOne({
        where: { id: userId },
        include: [
          {
            model: db.Book,
            as: "favorites",
          },
        ],
      });
      const book = await db.Book.findOne({ where: { id: bookId } });
      await user.removeFavorite([book]);

      const currentUser = await db.User.findOne({
        where: { id: userId },
        include: [
          {
            model: db.Book,
            as: "favorites",
          },
        ],
      });
      const { favorites } = currentUser;
      response.status(200).send({ favorites });
      return;
    }
    let currentUser = await db.User.findOne({
      where: { id: userId },
    });

    const book = await db.Book.findOne({ where: { id: bookId } });

    await currentUser.addFavorite([book]);

    currentUser = await db.User.findOne({
      where: { id: userId },
      include: [
        {
          model: db.Book,
          as: "favorites",
        },
      ],
    });
    const { favorites } = currentUser;
    response.status(200).send({ favorites });
  } catch (err) {
    console.error("ERROR >>>>", err);
  }
};

exports.toShoplist = async (request, response) => {
  try {
    const {
      body: { userId, bookId },
    } = request;
    const shoplistItem = await db.BookUserShoplist.findOne({
      where: {
        userId,
        bookId,
      },
    });

    if (shoplistItem) {
      const user = await db.User.findOne({
        where: { id: userId },
        include: [
          {
            model: db.Book,
            as: "shoplist",
          },
        ],
      });
      const book = await db.Book.findOne({ where: { id: bookId } });
      await user.removeShoplist([book]);

      const currentUser = await db.User.findOne({
        where: { id: userId },
        include: [
          {
            model: db.Book,
            as: "shoplist",
          },
        ],
      });
      const { shoplist } = currentUser;

      response.status(200).send({ shoplist });
      return;
    }
    let currentUser = await db.User.findOne({
      where: { id: userId },
    });

    const book = await db.Book.findOne({ where: { id: bookId } });

    await currentUser.addShoplist([book]);

    currentUser = await db.User.findOne({
      where: { id: userId },
      include: [
        {
          model: db.Book,
          as: "shoplist",
        },
      ],
    });

    const { shoplist } = currentUser;
    response.status(200).send({ shoplist });
  } catch (err) {
    console.error("ERROR >>>>", err);
    response.status(400).send("Something went terribly wrong");
  }
};
