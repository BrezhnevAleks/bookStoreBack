const utils = require("../utils");
const db = require("../models/index");

module.exports.tokenChecking = (request, response, next) => {
  const {
    headers: { authorization },
  } = request;

  try {
    utils.verifyToken(authorization);
  } catch (err) {
    return response.status(403).send("Token must be provided");
  }

  return next();
};
