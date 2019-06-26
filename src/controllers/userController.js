const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("dotenv").config();

module.exports.newUser = (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name
  };

  const newUser = new User(data);

  newUser.save((error, doc) => {
    if (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(201).json({
      success: true,
      message: "User successful created",
      userId: doc._id,
      userName: doc.name
    });
  });
};

// Login User and get him Token for access to some route action
module.exports.login = (req, res) => {
  passport.authenticate(
    "local",
    {
      session: true
    },
    (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          success: false,
          message: info ? info.message : "Login failed",
          user: user
        });
      }

      req.login(
        user,
        {
          session: false
        },
        err => {
          if (err) {
            res.status(400).json({ success: false, error: err.massage });
          }

          const token = jwt.sign(
            { user: user._id, email: user.email },
            "secret_super_nano_KEY_MEGA"
          );

          return res.json({
            success: true,
            message: "Success Login",
            userId: user._id,
            userName: user.name,
            token: token
          });
        }
      );
    }
  )(req, res);
};

module.exports.updatePass = async (req, res) => {
  const newPassword = req.body.newPassword;
  const id = req.body.id;

  const userUpdate = await User.findById({ _id: id });
  userUpdate.password = newPassword;
  userUpdate.save((err, updatedUser) => {
    if (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }

    res.status(301).json({
      success: true,
      message: "Success Pass Changed"
    });
  });
};

module.exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "User successfully Logout"
  });
};
