const express = require("express");
const router = express.Router();
const { authCheck } = require("../middleware/authCheck.js");
const userController = require("../controllers/userController.js");
const goalController = require("../controllers/goalController.js");
const taskController = require("../controllers/taskController.js");
const passport = require("passport");

// PUBLIC ROUTES
// @POST /registration
router.post("/register", userController.newUser);
// @POST /login - auth
router.post("/login", userController.login);
// @GET /logout - logout
router.get("/logout", userController.logout);
// @PUT /update - update user password
router.put("/update", userController.updatePass);

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
  })
);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
  })
);
router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
  })
);

// PROTECTED ROUTES

// Routes for Goals manipulation
// @POST /goal
router.get(
  "/goal",
  passport.authenticate("jwt", { session: false }),
  goalController.getAllGoalsByOwnerId
);
router.post(
  "/goal",
  passport.authenticate("jwt", { session: false }),
  goalController.createNewGoal
);
router.put(
  "/goal",
  passport.authenticate("jwt", { session: false }),
  goalController.updateGoal
);
router.delete(
  "/goal",
  passport.authenticate("jwt", { session: false }),
  goalController.deleteGoal
);

router.get(
  "/task",
  passport.authenticate("jwt", { session: false }),
  taskController.getOneTask
);

router.put(
  "/task",
  passport.authenticate("jwt", { session: false }),
  taskController.updateTask
);

router.delete(
  "/task",
  passport.authenticate("jwt", { session: false }),
  taskController.deleteTask
);

module.exports = router;
