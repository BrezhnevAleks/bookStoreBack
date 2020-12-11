const db = require("../models/index");
const utils = require("../utils");

exports.updateUser = async (request, response) => {
  try {
    const { id, email, login, password } = request.body;
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
    if (!user) {
      response.status(404).send("User not found");
      return;
    }
    await user.update(
      {
        email,
        login,
        password: password ? utils.cipher(password) : user.password,
      },
      {
        where: id,
      },
    );
    response.send(user);
  } catch (err) {
    response.status(500).send("Something went wrong");
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
        { where: { bookId, userId } },
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
    const rated = await reviews.filter((item) => item.rating !== null);

    const rate = (
      rated.reduce((acc, item) => acc + item.rating, 0) / rated.length
    ).toFixed(2);

    const book = await db.Book.findByPk(bookId);

    if (book) {
      await db.Book.update({ rating: rate }, { where: { id: bookId } });

      response.send("Success");
      return;
    }

    response.status(404).send(`Book id ${bookId} not found`);
  } catch (err) {
    response.status(500).send("Something went terribly wrong");
  }
};
