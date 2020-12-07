"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BookUserFavorites extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BookUserFavorites.belongsTo(models.User, {
        foreignKey: "userId",
        as: "users",
        // onDelete: "CASCADE",
      });
      BookUserFavorites.belongsTo(models.Book, {
        foreignKey: "bookId",
        as: "favorites",
        // onDelete: "CASCADE",
      });
    }
  }
  BookUserFavorites.init(
    {
      bookId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "BookUserFavorites",
    }
  );
  return BookUserFavorites;
};
