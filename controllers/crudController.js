const utils = require("../utils.js");
const db = require("../models/index");

exports.createUser = async (request, response) => {
  const {
    body: { login, email, password },
  } = request;
  console.log(login, email, password);
  {
    try {
      if (password.length < 6) {
        response.status(400).send("Password is too short");
        return;
      }

      const userExist = await db.User.findOne({ where: { email: email } });

      if (userExist !== null) {
        response.status(400).send("User already exists");
        return;
      }

      let user = await db.User.create({
        login,
        email,
        password: utils.cipher(password),
      });

      const createdToken = utils.createToken(user.id);
      user = await db.User.findOne({
        where: {
          login,
          email,
        },
        include: [
          {
            model: db.Book,
            as: "favorites",
          },
          {
            model: db.Book,
            as: "products",
          },
        ],
      });
      response.send({ user: user, token: createdToken });
    } catch (err) {
      response.status(500).send("Something went wrong");
    }
  }
};

exports.loginUser = async (request, response) => {
  const {
    body: { email, password },
  } = request;
  const searchedValue = { email };

  try {
    const user = await db.User.findOne({
      where: searchedValue,
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

    if (user === null) {
      response.status(404).send("User not found");
      return;
    }

    if (user.password !== utils.cipher(password)) {
      response.status(404).send("Invalid password");
      return;
    }

    const createdtoken = utils.createToken(user.id);
    response.send({ user: user, token: createdtoken });
  } catch (err) {
    console.error("ERROR >>>>", err);
    response.status(500).send("Something went wrong");
  }
};

exports.getByToken = async (request, response) => {
  try {
    const { authorization } = request.headers;
    const id = utils.verifyToken(authorization).data;

    const user = await db.User.findOne({
      where: { id },
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

    if (user === null) {
      response.status(404).send("User not found");
      return;
    }

    const createdtoken = utils.createToken(user.id);
    response.send({ user: user });
  } catch (err) {
    response.status(500).send("Something went wrong");
  }
};

exports.updateUser = async (request, response) => {
  const {
    body: { id, email, login, password },
  } = request;

  try {
    const user = await db.User.findOne({ where: id });
    if (!user) {
      response.status(404).send(`User not found`);
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
      }
    );
    response.send({ user: user });
  } catch (err) {
    response.status(500).send(`Something went wrong`);
  }
};
