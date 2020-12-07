"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Genres", [
      {
        value: "fantasy",
        label: "Фантастика",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        value: "detective",
        label: "Детектив",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        value: "classic",
        label: "Классика",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        value: "journey",
        label: "Путешестия",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        value: "textbooks",
        label: "Учебники",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        value: "kids",
        label: "Детские книги",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        value: "poetry",
        label: "Поэзия",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Genres", null, {});
  },
};
