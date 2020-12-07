const crypto = require("crypto");
const config = require("./config/index");
const jwt = require("jsonwebtoken");
const db = require("./models");

module.exports.checkAndUpdate = async (id, val) => {
  if (val === "") return;
  await db.User.update(
    { val },
    {
      where: id,
    }
  );
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
    config.token.secret
  );
};

module.exports.verifyToken = (token) => {
  return jwt.verify(token, config.token.secret);
};

module.exports.sortingType = (books, filter) => {
  switch (filter) {
    case "default":
      books.sort((a, b) => {
        return a.id - b.id;
      });
      break;
    case "expensive":
      books.sort((a, b) => {
        return b.price - a.price;
      });
      break;
    case "name":
      books.sort((a, b) => {
        let nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      break;
    case "rating":
      books.sort((a, b) => {
        return Number(b.rating) - Number(a.rating);
      });
      break;
  }
};
