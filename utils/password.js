const crypto = require("crypto");
const config = require("../config");

module.exports.cipher = (pass) => {
  return crypto
    .createHmac(config.hash.type, config.hash.key)
    .update(pass.trim())
    .digest("hex");
};
