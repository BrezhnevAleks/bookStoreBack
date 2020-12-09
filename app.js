const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRouter = require("./routes/userRouter");
const bookRouter = require("./routes/bookRouter");
const crudRouter = require("./routes/crudRouter");

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("uploads"));

app.use("/crud", crudRouter);
app.use("/users", userRouter);
app.use("/books", bookRouter);

module.exports = app;
