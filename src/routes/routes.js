const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const goalController = require("../controllers/goalController.js");
const taskController = require("../controllers/taskController.js");
const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  const userToken = req.header("Authorization");

  try {
    const decoded = jwt.verify(userToken, "secret_super_nano_KEY_MEGA");
    console.log(decoded);
    next();
  } catch (err) {
    res.status(444).json({
      message: "Bad token " + err.message
    });
  }
};

// @POST /registration
router.post("/register", userController.newUser);
// @POST /login - auth
router.post("/login", userController.login);
// @GET /logout - logout
router.get("/logout", userController.logout);
// @PUT /update - update user password
router.put("/update", userController.updatePass);

// Routes for Goals manipulation
// @POST /goal
router.post("/goal", goalController.createNewGoal);
router.get("/goal", authCheck, goalController.getAllGoalsByOwnerId);
router.delete("/goal", goalController.deleteGoal);

router.get("/task", taskController.getOneTask);
module.exports = router;
