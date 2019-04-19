const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      trim: true
    },
    githubId: {
      type: Number
    },
    facebookId: {
      type: String
    },
    googleId: {
      type: String
    },
    name: {
      type: String
    },
    avatar: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

UserSchema.pre("save", function(next) {
  // об'єкт юзера який зберігається
  const user = this;
  console.log(user);
  if (!user.password) {
    return next();
  }

  // isModified - це метод mongoose.Document провіряє чи поле значення змінилось - повертає буль (true or false)
  // isNew - провіряє чи це новий документ - повертає буль (true or false)
  if (this.isModified("password") || this.isNew) {
    console.log(user.password);
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(pw, cb) {
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    return cb(null, isMatch);
  });
};

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSalt(10), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.getJWT = function() {
  let expiration_time = parseInt(process.env.JWT_EXPIRATION);
  return (
    "Bearer " +
    jwt.sign(
      {
        user_id: this._id
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: expiration_time
      }
    )
  );
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
