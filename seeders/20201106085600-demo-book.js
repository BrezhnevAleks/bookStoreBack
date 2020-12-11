module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("Books", [
      {
        name: "Book 1",
        author: "John Doe",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Another Book",
        author: "Don Johns",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Book 2",
        author: "Don Johns",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Book 3",
        author: "Don Johns",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Book 4",
        author: "Don Johns",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Book 5",
        author: "John Doe",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Book 6",
        author: "Don Johns",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Book 7",
        author: "Don Johns",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Book 8",
        author: "Don Johns",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Book 9",
        author: "Don Johns",
        picture: "picture",
        price: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete("Books", null, {});
  },
};
