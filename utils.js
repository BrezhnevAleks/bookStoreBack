const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("./config");
const db = require("./models");

module.exports.checkAndUpdate = async (id, val) => {
  if (!val) return;
  await db.User.update(val, {
    where: id,
  });
};

module.exports.cipher = (pass) => {
  return crypto
    .createHmac("sha256", "secretword")
    .update(pass.trim())
    .digest("hex");
};

module.exports.createToken = (information) => {
  return jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 320, data: information },
    config.token.secret,
  );
};

module.exports.verifyToken = (token) => {
  return jwt.verify(token, config.token.secret);
};
