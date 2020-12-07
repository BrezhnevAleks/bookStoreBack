"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Review, {
        foreignKey: "userId",
        as: "reviews",
        onDelete: "CASCADE",
      });

      User.belongsToMany(models.Book, {
        through: models.BookUserFavorites,
        foreignKey: "userId",
        as: "favorites",
        onDelete: "CASCADE",
      });
      User.belongsToMany(models.Book, {
        through: models.BookUserShoplist,
        foreignKey: "userId",
        as: "shoplist",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      login: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
