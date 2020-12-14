const tokenCheck = require("../utils/token.js");
const db = require("../models/index");

module.exports.tokenAuth = async (request, response, next) => {
  try {
    const {
      headers: { authorization },
    } = request;

    const token = authorization.slice(7);
    const auth = tokenCheck.verifyToken(token);
    const { data } = auth;
    const user = await db.User.findByPk(data);
    if (!user) {
      response.status(404).send("User not found");
      return;
    }
    next();
  } catch (err) {
    return response.status(403).send("Token must be provided");
  }
};
