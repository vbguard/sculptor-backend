const express = require("express");
const router = express.Router();
const { authCheck } = require("../middleware/authCheck.js");
const userController = require("../controllers/userController.js");
const goalController = require("../controllers/goalController.js");
const taskController = require("../controllers/taskController.js");
const passport = require("passport");

/**
 * @swagger
 *
 *  components:
 *    securitySchemes:
 *      bearerAuth:            # arbitrary name for the security scheme
 *        type: https
 *        scheme: bearer
 *        bearerFormat: JWT
 */
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
// @GET /goal
/**
 * @swagger
 *
 * /api/goal/{userId}:
 *   get:
 *     tags:
 *       - GOAL
 *     summary: Returns a list of user's Goals.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         schema:
 *            type: string
 *         description: The user ID.
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOTk2MmQ0ZGVlOWJhNDAyYzJhODZmOSIsImVtYWlsIjoiM3YyaWt0bzN3d3I0QHRlc3R0a2hpcy5jb20iLCJuYW1lIjoiVGVzdCBTdXBlIiwiaWF0IjoxNTUzNTU3NzI0LCJleHAiOjE1NTM1Njc3MjR9.Yuqy_d1NheW5osTAdzjSUrgAurZtXIZMjQnpTTufzhs"
 *         description: When you login write token to localStorage. Example - Bearer eyJhbGciOiJIUzI1N...
 *     responses:
 *       200:
 *         description: Return json some two fields of user's Goals and Tasks.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: "User has some Goals"
 *                data:
 *                 type: array
 *                 example: [{"goalNumber":1,"goalTasks":[{"taskWeekRange":[{"week":1,"status":true},{"week":2,"status":false},{"week":3,"status":false},{"week":4,"status":false},{"week":5,"status":false},{"week":6,"status":false},{"week":7,"status":false},{"week":8,"status":false},{"week":9,"status":false}],"taskCreateDate":"2019-04-19T13:01:32.751Z","isComplete":false,"_id":"5cb9c6ae3a3716ba53565876","taskTitle":"Jjiijjgg nano","goalId":"5cb9c6ae3a3716ba53565874","taskActiveDates":[{"isDone":false,"_bsontype":"ObjectID","id":{"type":"Buffer","data":[92,193,184,33,72,170,118,10,4,110,160,33]}},{"isDone":true,"date":"2019-04-20T13:01:32.751Z","_id":"5cc1b64248aa760a046ea01d"},{"isDone":true,"date":"2019-04-24T12:36:53.000Z","_id":"5cc1b64e48aa760a046ea01e"}],"__v":0},{"taskWeekRange":[{"week":1,"status":false},{"week":2,"status":false},{"week":3,"status":false},{"week":4,"status":false},{"week":5,"status":false},{"week":6,"status":false},{"week":7,"status":false},{"week":8,"status":false},{"week":9,"status":false}],"taskCreateDate":"2019-04-19T13:01:32.751Z","isComplete":false,"_id":"5cb9c6ae3a3716ba53565877","taskTitle":"UpdateTASK Title","goalId":"5cb9c6ae3a3716ba53565874","taskActiveDates":[{"isDone":true,"date":"2019-04-21T13:01:32.751Z","_id":"5cc1b62248aa760a046ea01b"}],"__v":0}],"goalCompleted":false,"_id":"5cb9c6ae3a3716ba53565874","goalTitle":"Update Goal Title","goalMotivation":"SUPER MOTIVATION","ownerId":"5cb9963d06b961a1025d6000","__v":0,"goalColor":"#eed8f2"},{"goalNumber":2,"goalTasks":[{"taskWeekRange":[{"week":1,"status":true},{"week":2,"status":false},{"week":3,"status":false},{"week":4,"status":false},{"week":5,"status":false},{"week":6,"status":false},{"week":7,"status":false},{"week":8,"status":false},{"week":9,"status":false}],"taskCreateDate":"2019-04-19T13:27:17.187Z","isComplete":false,"_id":"5cb9d14ffeb784bcfadde80a","taskTitle":"Task11","goalId":"5cb9d14ffeb784bcfadde809","taskActiveDates":[{"isDone":false,"date":"2019-04-25T12:36:53.000Z","_id":"5cc1b5f448aa760a046ea018"},{"isDone":false,"date":"2019-04-30T12:36:53.000Z","_id":"5cc1b60048aa760a046ea019"},{"isDone":true,"date":"2019-04-22T12:36:53.000Z","_id":"5cc1b60c48aa760a046ea01a"}],"__v":0},{"taskWeekRange":[{"week":1,"status":false},{"week":2,"status":false},{"week":3,"status":false},{"week":4,"status":false},{"week":5,"status":false},{"week":6,"status":false},{"week":7,"status":false},{"week":8,"status":false},{"week":9,"status":false}],"taskCreateDate":"2019-04-19T13:27:17.187Z","isComplete":false,"_id":"5cb9d14ffeb784bcfadde80b","taskTitle":"Task12","goalId":"5cb9d14ffeb784bcfadde809","taskActiveDates":[{"isDone":false,"date":"2019-04-19T13:27:17.187Z","_id":"5cc1b5d948aa760a046ea016"},{"isDone":false,"date":"2019-04-24T12:36:53.000Z","_id":"5cc1b5e548aa760a046ea017"}],"__v":0},{"taskWeekRange":[{"week":1,"status":true},{"week":2,"status":false},{"week":3,"status":true},{"week":4,"status":true},{"week":5,"status":false},{"week":6,"status":false},{"week":7,"status":true},{"week":8,"status":false},{"week":9,"status":false}],"taskCreateDate":"2019-04-19T13:27:17.187Z","isComplete":false,"_id":"5cb9d14ffeb784bcfadde80c","taskTitle":"Task13","goalId":"5cb9d14ffeb784bcfadde809","taskActiveDates":[{"isDone":false,"date":"2019-04-24T13:01:32.751Z","_id":"5cc1b59d48aa760a046ea013"},{"isDone":false,"date":"2019-04-24T12:36:53.000Z","_id":"5cc1b5af48aa760a046ea014"},{"isDone":true,"date":"2019-04-19T13:01:32.751Z","_id":"5cc1b5bf48aa760a046ea015"}],"__v":0}],"goalCompleted":false,"_id":"5cb9d14ffeb784bcfadde809","goalTitle":"Gola TITLE","ownerId":"5cb9963d06b961a1025d6000","__v":0,"goalColor":"#dee5e8"}]
 *                tasks:
 *                  type: array
 *                  example: [{"taskWeekRange":[{"week":1,"status":true},{"week":2,"status":false},{"week":3,"status":false},{"week":4,"status":false},{"week":5,"status":false},{"week":6,"status":false},{"week":7,"status":false},{"week":8,"status":false},{"week":9,"status":false}],"taskCreateDate":"2019-04-19T13:01:32.751Z","isComplete":false,"_id":"5cb9c6ae3a3716ba53565876","taskTitle":"Jjiijjgg nano","goalId":"5cb9c6ae3a3716ba53565874","taskActiveDates":[{"isDone":false,"_bsontype":"ObjectID","id":{"type":"Buffer","data":[92,193,184,33,72,170,118,10,4,110,160,33]}},{"isDone":true,"date":"2019-04-20T13:01:32.751Z","_id":"5cc1b64248aa760a046ea01d"},{"isDone":true,"date":"2019-04-24T12:36:53.000Z","_id":"5cc1b64e48aa760a046ea01e"}],"__v":0},{"taskWeekRange":[{"week":1,"status":false},{"week":2,"status":false},{"week":3,"status":false},{"week":4,"status":false},{"week":5,"status":false},{"week":6,"status":false},{"week":7,"status":false},{"week":8,"status":false},{"week":9,"status":false}],"taskCreateDate":"2019-04-19T13:01:32.751Z","isComplete":false,"_id":"5cb9c6ae3a3716ba53565877","taskTitle":"UpdateTASK Title","goalId":"5cb9c6ae3a3716ba53565874","taskActiveDates":[{"isDone":true,"date":"2019-04-21T13:01:32.751Z","_id":"5cc1b62248aa760a046ea01b"}],"__v":0},{"taskWeekRange":[{"week":1,"status":true},{"week":2,"status":false},{"week":3,"status":false},{"week":4,"status":false},{"week":5,"status":false},{"week":6,"status":false},{"week":7,"status":false},{"week":8,"status":false},{"week":9,"status":false}],"taskCreateDate":"2019-04-19T13:27:17.187Z","isComplete":false,"_id":"5cb9d14ffeb784bcfadde80a","taskTitle":"Task11","goalId":"5cb9d14ffeb784bcfadde809","taskActiveDates":[{"isDone":false,"date":"2019-04-25T12:36:53.000Z","_id":"5cc1b5f448aa760a046ea018"},{"isDone":false,"date":"2019-04-30T12:36:53.000Z","_id":"5cc1b60048aa760a046ea019"},{"isDone":true,"date":"2019-04-22T12:36:53.000Z","_id":"5cc1b60c48aa760a046ea01a"}],"__v":0},{"taskWeekRange":[{"week":1,"status":false},{"week":2,"status":false},{"week":3,"status":false},{"week":4,"status":false},{"week":5,"status":false},{"week":6,"status":false},{"week":7,"status":false},{"week":8,"status":false},{"week":9,"status":false}],"taskCreateDate":"2019-04-19T13:27:17.187Z","isComplete":false,"_id":"5cb9d14ffeb784bcfadde80b","taskTitle":"Task12","goalId":"5cb9d14ffeb784bcfadde809","taskActiveDates":[{"isDone":false,"date":"2019-04-19T13:27:17.187Z","_id":"5cc1b5d948aa760a046ea016"},{"isDone":false,"date":"2019-04-24T12:36:53.000Z","_id":"5cc1b5e548aa760a046ea017"}],"__v":0},{"taskWeekRange":[{"week":1,"status":true},{"week":2,"status":false},{"week":3,"status":true},{"week":4,"status":true},{"week":5,"status":false},{"week":6,"status":false},{"week":7,"status":true},{"week":8,"status":false},{"week":9,"status":false}],"taskCreateDate":"2019-04-19T13:27:17.187Z","isComplete":false,"_id":"5cb9d14ffeb784bcfadde80c","taskTitle":"Task13","goalId":"5cb9d14ffeb784bcfadde809","taskActiveDates":[{"isDone":false,"date":"2019-04-24T13:01:32.751Z","_id":"5cc1b59d48aa760a046ea013"},{"isDone":false,"date":"2019-04-24T12:36:53.000Z","_id":"5cc1b5af48aa760a046ea014"},{"isDone":true,"date":"2019-04-19T13:01:32.751Z","_id":"5cc1b5bf48aa760a046ea015"}],"__v":0}]
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
 *                  example: "This User don't have any Goals"
 *       401:
 *         description: Access token is missing or invalid
 */
router.get(
  "/goal/:userId",
  passport.authenticate("jwt", { session: false }),
  goalController.getAllGoalsByOwnerId
);
/**
 * @swagger
 *
 * /api/goal:
 *   post:
 *     schemes:
 *       - https
 *     tags:
 *       - GOAL
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
