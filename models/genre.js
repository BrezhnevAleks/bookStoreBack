const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Genre.belongsToMany(models.Book, {
        through: models.BookGenre,
        foreignKey: "genreId",
        as: "books",
      });
    }
  }
  Genre.init(
    {
      value: DataTypes.STRING,
      label: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Genre",
    },
  );
  return Genre;
};
