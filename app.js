const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const user = require("./routes/user");
const book = require("./routes/book");
const auth = require("./routes/auth");
const booklists = require("./routes/booklists");

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("uploads"));

app.use("/auth", auth);
app.use("/users", user);
app.use("/books", book);
app.use("/booklists", booklists);

module.exports = app;
