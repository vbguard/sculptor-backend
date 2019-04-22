const express = require("express");
const router = express.Router();
const { authCheck } = require("../middleware/authCheck.js");
const userController = require("../controllers/userController.js");
const goalController = require("../controllers/goalController.js");
const taskController = require("../controllers/taskController.js");
const passport = require("passport");

// PUBLIC ROUTES
// @POST /registration
/**
 * @swagger
 *
 * /api/register:
 *   post:
 *     tags:
 *       - Register
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - email
 *              - password
 *             properties:
 *               email:
 *                  type: string
 *               password:
 *                  type: string
 *     responses:
 *       200:
 *         description: Return json with User data create
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: string
 *                  example: "5c9962d4dee9ba402c2a86f9"
 *                token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOTk2MmQ0ZGVlOWJhNDAyYzJhODZmOSIsImVtYWlsIjoiM3YyaWt0bzN3d3I0QHRlc3R0a2hpcy5jb20iLCJuYW1lIjoiVGVzdCBTdXBlIiwiaWF0IjoxNTUzNTU2MzA2LCJleHAiOjE1NTM1NjYzMDZ9.I2V0TAlpJQdLz0x03gpfJpEPhR17MBvIyFzI3WuVXY4"
 *       400:
 *         description: If not correct data request
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: "some error written here"
 */
router.post("/register", userController.newUser);
// @POST /login - auth
/**
 * @swagger
 *
 * /api/login:
 *   post:
 *     tags:
 *       - Login
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - username
 *              - password
 *             properties:
 *               username:
 *                  type: string
 *                  example: "user@user.com"
 *               password:
 *                  type: string
 *                  example: "userPassword"
 *     responses:
 *       200:
 *         description: Return json with User data create
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                userId:
 *                  type: string
 *                  example: "5c9962d4dee9ba402c2a86f9"
 *                token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOTk2MmQ0ZGVlOWJhNDAyYzJhODZmOSIsImVtYWlsIjoiM3YyaWt0bzN3d3I0QHRlc3R0a2hpcy5jb20iLCJuYW1lIjoiVGVzdCBTdXBlIiwiaWF0IjoxNTUzNTU2MzA2LCJleHAiOjE1NTM1NjYzMDZ9.I2V0TAlpJQdLz0x03gpfJpEPhR17MBvIyFzI3WuVXY4"
 *       400:
 *         description: If not correct data request
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: "Incorrect email or password."
 *                userID:
 *                  type: boolean
 *                  example: false
 */
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
