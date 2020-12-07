"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Books", [
      {
        name: "Totally Cool Book",
        author: "John Doe",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Another Cool Book",
        author: "Don Johns",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Fun Cool Book",
        author: "Don Johns",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Another Cool Book",
        author: "Don Johns",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Interesting",
        author: "Don Johns",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Books", null, {});
  },
};
