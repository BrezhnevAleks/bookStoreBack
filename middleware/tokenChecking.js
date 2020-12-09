const utils = require("../utils");

module.exports.tokenChecking = (request, response, next) => {
  const {
    headers: { authorization },
  } = request;

  try {
    utils.verifyToken(authorization);
    next();
  } catch (err) {
    return response.status(403).send("Token must be provided");
  }
};
