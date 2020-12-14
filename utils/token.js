const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports.createToken = (information) => {
  return jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 320, data: information },
    config.token.secret,
  );
};

module.exports.verifyToken = (token) => {
  return jwt.verify(token, config.token.secret);
};
