"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Book.hasMany(models.Review, {
        foreignKey: "bookId",
        as: "reviews",
        onDelete: "CASCADE",
      });
      Book.belongsToMany(models.User, {
        through: models.BookUserFavorites,
        foreignKey: "bookId",
        as: "users",
        onDelete: "CASCADE",
      });
      Book.belongsToMany(models.User, {
        through: models.BookUserShoplist,
        foreignKey: "bookId",
        as: "buyers",
        onDelete: "CASCADE",
      });
      Book.belongsToMany(models.Genre, {
        through: models.BookGenre,
        foreignKey: "bookId",
        as: "genres",
        onDelete: "CASCADE",
      });
    }
  }
  Book.init(
    {
      name: DataTypes.STRING,
      author: DataTypes.STRING,
      picture: DataTypes.STRING,
      price: DataTypes.INTEGER,
      rating: { type: DataTypes.FLOAT, allowNull: true },
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
