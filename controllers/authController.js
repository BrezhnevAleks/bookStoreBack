const tokenCheck = require("../utils/token.js");
const db = require("../models/index");
const pass = require("../utils/password.js");

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
        password: pass.cipher(password),
      },
    );
    const createdToken = tokenCheck.createToken(user.id);
    user = user.toJSON();
    delete user.password;
    response.send({ user, token: createdToken });
  } catch (err) {
    response.status(500).send("Something went wrong");
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
    });
    if (!user) {
      response.status(404).send("User not found");
      return;
    }
    if (user.password !== pass.cipher(password)) {
      response.status(404).send("Invalid password");
      return;
    }
    const { id } = user;
    const createdtoken = tokenCheck.createToken(id);
    user = user.toJSON();
    delete user.password;
    response.send({ user, token: createdtoken });
  } catch (err) {
    console.error("ERROR >>>>", err);
    response.status(500).send("Something went wrong");
  }
};

exports.getByToken = async (request, response) => {
  try {
    const { authorization } = request.headers;
    const id = tokenCheck.verifyToken(authorization.slice(7)).data;

    const user = await db.User.findByPk(id);

    if (!user) {
      response.status(404).send("User not found");
      return;
    }
    const createdtoken = tokenCheck.createToken(user.id);

    response.send({ user, token: createdtoken });
  } catch (err) {
    response.status(500).send("Something went wrong");
  }
};
