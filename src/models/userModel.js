const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

UserSchema.pre("save", function(next) {
  // Документ юзера який зберігається
  const user = this;

  // isModified - провіряє чи поле значення змінилось - повертає буль (true or false)
  // isNew - провіряє чи це новий документ - повертає буль (true or false)
  if (this.isModified("password") || this.isNew) {
    console.log(user.password);
    bcrypt.genSalt(14, function(err, salt) {
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
  let expiration_time = parseInt(CONFIG.jwt_expiration);
  return (
    "JWT " +
    jwt.sign(
      {
        user_id: this._id
      },
      CONFIG.jwt_encryption,
      {
        expiresIn: expiration_time
      }
    )
  );
};

const User = mongoose.model("User", UserSchema);

module.exports = User;