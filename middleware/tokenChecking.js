const utils = require("../utils");

module.exports.tokenChecking = (request, response, next) => {
  try {
    const {
      headers: { authorization },
    } = request;

    const token = authorization.slice(7);

    utils.verifyToken(token);
    next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return response.status(403).send("Token must be provided");
  }
};
