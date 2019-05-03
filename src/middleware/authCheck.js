const jwt = require("jsonwebtoken");

module.exports.authCheck = (req, res, next) => {
  let userToken = req.headers["x-access-token"] || req.headers["authorization"];

  if (userToken.startsWith("Bearer ")) {
    // Remove Bearer from string
    userToken = userToken.slice(7, userToken.length);
  }

  if (userToken) {
    jwt.verify(userToken, "secret_super_nano_KEY_MEGA", (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Token is not valid"
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
};
