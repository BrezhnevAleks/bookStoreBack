const utils = require("../utils.js");
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

    if (favorite !== null) {
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

    if (shoplistItem !== null) {
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
  }
};

exports.addReview = async (request, response) => {
  const {
    body: { userId, bookId, text, rating },
  } = request;
  try {
    const existingReview = await db.Review.findOne({
      where: { bookId, userId },
    });

    if (existingReview !== null) {
      await existingReview.update(
        {
          text: text || existingReview.text,
          rating: rating || existingReview.rating,
        },
        { where: { bookId, userId } }
      );
    } else {
      await db.Review.create({
        text,
        bookId,
        userId,
        rating,
      });
    }

    const reviews = await db.Review.findAll({
      where: { bookId },
      include: {
        model: db.User,
        as: "user",
        attributes: ["login"],
      },
    });
    let rated = await reviews.filter((item) => item.rating != null);

    let rate = (
      rated.reduce((acc, item) => acc + item.rating, 0) / rated.length
    ).toFixed(2);

    const book = await db.Book.findOne({ where: { id: bookId } });

    if (book === null) {
      response.status(404).send(`Book id ${bookId} not found`);
      return;
    }

    await db.Book.update({ rating: rate }, { where: { id: bookId } });

    response.status(200).send("Success");
  } catch (err) {
    response.status(400).send("Something went terribly wrong");
  }
};
