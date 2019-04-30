const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/userModel.js");

module.exports = function(passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = "secret_super_nano_KEY_MEGA";

  passport.use(
    new JwtStrategy(opts, function(jwt_payload, done) {
      User.findOne({ _id: jwt_payload.user }, function(err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      });
    })
  );

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password"
      },
      function(username, password, done) {
        User.findOne({ email: username }, function(err, user) {
          if (err) throw err;

          if (!user) {
            return done(null, false, { message: "Unknown User" });
          }

          user.comparePassword(password, function(err, isMatch) {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Invalid password" });
            }
          });
        });
      }
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(
    new GitHubStrategy(
      {
        clientID: "a3cfb2a6ef8f0285d5f9",
        clientSecret: "129e72baafa648a4dfd64a3fdd7f8391f8abcf52",
        callbackURL: `https://sculptor.vbguard.dev/api/auth/github/callback`
      },
      async function(accessToken, refreshToken, profile, done) {
        try {
          const user = await User.findOne({ githubId: profile.id });

          if (user) {
            return done(err, user);
          }

          if (!user) {
            const newUser = new User({
              githubId: profile._json.id,
              name: profile._json.name,
              avatar: profile._json.avatar_url
            });

            newUser.save((err, user) => {
              return done(err, user);
            });
          }
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: "543139662877063",
        clientSecret: "e67db023591d9f166412a6edbb7ee70a",
        callbackURL: `https://sculptor.vbguard.dev/api/auth/facebook/callback`
      },
      async function(accessToken, refreshToken, profile, done) {
        try {
          const user = await User.findOne({ facebookId: profile.id });
          if (user) {
            return done(err, user);
          }

          if (!user) {
            const newUser = await new User({
              githubId: profile._json.id,
              name: profile._json.name
            });

            newUser.save((err, user) => {
              return done(err, user);
            });
          }
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "688951936234-4iru87hiur6r0tb1bt6o6vnp52mn24kv.apps.googleusercontent.com",
        clientSecret: "FjZN3FwmFdMqJMYhVskFuw0P",
        callbackURL: `https://sculptor.vbguard.dev/api/auth/google/callback`
      },
      async function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        try {
          const user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(err, user);
          }

          if (!user) {
            const newUser = await new User({
              googleId: profile._json.sub,
              name: profile._json.name,
              avatar: profile._json.picture
            });

            newUser.save((err, user) => {
              return done(err, user);
            });
          }
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};
