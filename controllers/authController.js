const utils = require("../utils.js");
const db = require("../models/index");

exports.createUser = async (request, response) => {
  try {
    const {
      body: { login, email, password },
    } = request;

    if (password.length < 6) {
      response.status(400).send("Password is too short");
      return;
    }

    const userExist = await db.User.findOne({
      where: { email },
    });

    if (userExist) {
      response.status(400).send("User already exists");
      return;
    }
    let user = await db.User.create(
      {
        login,
        email,
        password: utils.cipher(password),
        favorites: [],
        shoplist: [],
      },
      {
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
      }
    );
    const createdToken = utils.createToken(user.id);
    user = user.toJSON();
    delete user.password;
    response.send({ user, token: createdToken });
  } catch (err) {
    response.status(500).send("Something went wrong");
    console.log(err);
  }
};

exports.loginUser = async (request, response) => {
  try {
    const {
      body: { email, password },
    } = request;
    const searchedValue = { email };
    let user = await db.User.findOne({
      where: searchedValue,
      attributes: {
        include: ["password"],
      },
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
      if (user.password !== utils.cipher(password)) {
        response.status(404).send("Invalid password");
        return;
      }
      const { id } = user;
      const createdtoken = utils.createToken(id);
      user = await db.User.findByPk(id, {
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
      response.send({ user, token: createdtoken });
      return;
    }

    response.status(404).send("User not found");
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

    if (user) {
      const createdtoken = utils.createToken(user.id);
      response.send({ user, token: createdtoken });
      return;
    }
    response.status(404).send("User not found");
    // const userObject = user.toJSON();
  } catch (err) {
    response.status(500).send("Something went wrong");
  }
};
