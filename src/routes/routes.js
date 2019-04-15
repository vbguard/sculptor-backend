const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

// auth
// @POST /registration
router.post("/register", userController.newUser);

// @POST /login - auth
router.post("/login", userController.login);

// @GET /logout - logout
router.get("/logout", (req, res) => {
  console.log(req.body);
  res.json({
    success: true,
    message: "User Abra successful logout"
  });
});

router.put("/update", userController.updatePass);

module.exports = router;
