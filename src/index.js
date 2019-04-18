require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("morgan");
const cors = require("cors");

const mongoose = require("mongoose");

const router = require("./routes/routes.js");

const urlDb = process.env.URL_MONGODB;

mongoose
  .connect(urlDb, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(
    () => {
      console.log("MongoDB connected...");
    },
    err => {
      console.log(err);
    }
  );

app.use(logger("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/", express.static("public"));

app.use("/api", router);

const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
  console.log(`Server start on ${process.env.PORT} port`);
});
