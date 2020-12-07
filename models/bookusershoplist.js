"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BookUserShoplist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BookUserShoplist.belongsTo(models.User, {
        foreignKey: "userId",
        as: "buyers",
      });
      BookUserShoplist.belongsTo(models.Book, {
        foreignKey: "bookId",
        as: "shoplist",
      });
    }
  }
  BookUserShoplist.init(
    {
      bookId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "BookUserShoplist",
    }
  );
  return BookUserShoplist;
};
