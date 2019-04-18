const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("dotenv").config();

module.exports.newUser = (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password
  };

  const newUser = new User(data);

  console.log(newUser);

  newUser.save((error, doc) => {
    if (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.json(doc);
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
            res.send(err);
          }

          const token = jwt.sign(
            { user: user._id, email: user.email },
            process.env.JWT_SECRET_KEY
          );
          
          return res.json({
            success: true,
            message: "Success Logined",
            userId: user._id,
            token: token
          });
        }
      );
    }
  )(req, res);
};

// module.exports.login = async (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   try {
//     const user = await User.findOne({ email });

//     user.comparePassword(password, (err, isMatch) => {
//       if (err) console.log(err);
//       if (isMatch) {
//         const token = jwt.sign(
//           { user: user.email },
//           "secret_super_nano_KEY_MEGA"
//         );

//         res.status(200).json({
//           success: true,
//           message: "User in DB",
//           userId: user._id,
//           token: token
//         });
//       } else {
//         res.status(401).json({
//           success: false,
//           message: "Not valid password"
//         });
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

module.exports.updatePass = async (req, res) => {
  const newPassword = req.body.newPassword;
  const id = req.body.id;

  console.log(req.body);

  const userUpdate = await User.findById({ _id: id });
  userUpdate.password = newPassword;
  await userUpdate.save();
  res.send(userUpdate);

  // User.findByIdAndUpdate(id, { password: newPassword }, (err, doc) => {
  //   if (err) res.json({ message: err.message });
  //   res.json(doc);
  // });

  // User.findOneAndUpdate(
  //   { _id: id },
  //   { $set: { password: newPassword } },
  //   { new: true },
  //   (err, doc) => {
  //     if (err) console.log(err);
  //     doc.save((err, doc) => {
  //       if (err) console.log(err);
  //       console.log(doc);
  //     });
  //     console.log(doc);
  //   }
  // );
};

module.exports.logout = (req, res) => {
  res.json({
    success: true,
    message: "User successfully Logout"
  });
};
