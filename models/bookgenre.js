const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BookGenre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BookGenre.belongsTo(models.Genre, {
        foreignKey: "genreId",
        as: "genres",
      });
      BookGenre.belongsTo(models.Book, {
        foreignKey: "bookId",
        as: "books",
      });
    }
  }
  BookGenre.init(
    {
      bookId: {
        type: DataTypes.INTEGER,
      },
      genreId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "BookGenre",
    },
  );
  return BookGenre;
};
