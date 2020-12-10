const db = require("../models/index");

exports.updateUser = async (request, response) => {
  try {
    const {
      body: { id, email, login, password },
    } = request;
    const user = await db.User.findByPk(id, {
      include: [
        {
          model: db.Book,
          as: "favorites",
        },
        {
          model: db.Book,
          as: "shoplist",
        },
      ],
    });
    if (user) {
      await user.update(
        {
          email,
          login,
          password: password ? utils.cipher(password) : user.password,
        },
        {
          where: id,
        }
      );
      response.send(user);
      console.log(user);
      return;
    }
    response.status(404).send("User not found");
  } catch (err) {
    response.status(500).send("Something went wrong");
  }
};

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

exports.addReview = async (request, response) => {
  try {
    const {
      body: { userId, bookId, text, rating },
    } = request;
    const existingReview = await db.Review.findOne({
      where: { bookId, userId },
    });

    if (existingReview) {
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
    const rated = await reviews.filter((item) => item.rating != null);

    const rate = (
      rated.reduce((acc, item) => acc + item.rating, 0) / rated.length
    ).toFixed(2);

    const book = await db.Book.findOne({ where: { id: bookId } });

    if (book) {
      await db.Book.update({ rating: rate }, { where: { id: bookId } });

      response.status(200).send("Success");
      return;
    }

    response.status(404).send(`Book id ${bookId} not found`);
  } catch (err) {
    response.status(400).send("Something went terribly wrong");
  }
};
