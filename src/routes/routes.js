const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const goalController = require("../controllers/goalController.js");
const taskController = require("../controllers/taskController.js");

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
router.get("/goal", goalController.getAllGoalsByOwnerId);
router.delete("/goal", goalController.deleteGoal);

router.get("/task", taskController.getOneTask);
module.exports = router;
