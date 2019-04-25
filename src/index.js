require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");

const swaggerDoc = require("./modules/swaggerDoc");
const mongoose = require("mongoose");

const router = require("./routes/routes.js");

mongoose
  .connect("mongodb://localhost:27017/sculptor", {
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

app.use(logger("common"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Passport
app.use(passport.initialize());
app.use(passport.session());

// Bring in defined Passport Strategy
require("./modules/passport")(passport);

swaggerDoc(app);

app.use("/", express.static("public"));

app.use("/api", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server start on ${process.env.PORT} port`);
});
