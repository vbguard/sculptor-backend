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
  .connect(
    "mongodb+srv://sculptor:sculptor34GH@sculptor-dqg3i.mongodb.net/sculptor?retryWrites=true",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
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
app.use(cors("*"));
app.options("*", cors()); // include before other routes

//Passport
app.use(passport.initialize());
app.use(passport.session());

// Bring in defined Passport Strategy
require("./modules/passport")(passport);

swaggerDoc(app);

app.use("/", express.static("public"));
app.use("/login", express.static("public"));
app.use("/registration", express.static("public"));
app.use("/dashboard", express.static("public"));
app.use("/results", express.static("public"));
app.use("/information", express.static("public"));

app.use("/api", router);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server start on ${PORT} port`);
});
