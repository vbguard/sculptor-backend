const Goal = require("../models/goalModel.js");
const Task = require("../models/taskModel.js");

module.exports.createNewGoal = async (req, res) => {
  /*
   * TODO:
   *  - goalTitle: String
   *  - goalMotivation: String
   *  - goalNumber: Number
   *  - goalTasks: [Task=>ref - save objectId]
   *  - goalColor: String
   *  - goalCompleted: Boolean, default: false
   *  - userId: String, required: true
   */

  const data = req.body;

  const goalDataNew = {
    goalTitle: data.goalTitle,
    goalMotivation: data.goalMotivation,
    goalNumber: data.goalNumber,
    goalColor: data.goalColor,
    userId: data.userId
  };

  //Створюємо новий документ ( Goal - Ціль )
  const newGoal = await new Goal(goalDataNew);

  const goalId = newGoal._id;

  if (data.goalTasks) {
    data.goalTasks = data.goalTasks.map(task => {
      return { ...task, goalId, taskColor: data.goalColor };
    });

    // .insertMany - метод для створення багато документів у відповідній колекції
    // приймає першим параметром масив або об'єкт данних «Array|Object|*»
    await Task.insertMany(data.goalTasks, (err, docs) => {
      newGoal.goalTasks = [...docs.map(task => task._id)];
      newGoal.save((err, goal) => {
        if (err) {
          res.json({
            success: false,
            message: err.message
          });
        }

        Task.populate(goal, { path: "goalTasks", model: "Task" }, function(
          err,
          goalTask
        ) {
          res.status(200).json({
            success: true,
            data: goalTask
          });
        });
      });
    });
  }

  if (!data.goalTasks) {
    newGoal.goalTasks = [];
    newGoal.save((err, goal) => {
      if (err) {
        res.json({
          success: false,
          message: err.message
        });
      }
      res.status(200).json({
        success: true,
        message: "create only Goal without tasks",
        data: goal
      });
    });
  }
};

module.exports.deleteGoal = async (req, res) => {
  try {
    const goalId = req.body.goalId;

    const goalToDelete = await Goal.findByIdAndDelete(goalId);

    res.json({
      success: true,
      message: `Goal by id: ${goalToDelete._id}, successful delete`
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    });
  }
};

module.exports.updateGoal = async (req, res) => {
  const goalId = req.params.goalId;
  const fieldsToUpdate = req.body.fieldsToUpdate;

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      { $set: fieldsToUpdate },
      {
        new: true
      }
    );

    res.status(202).json(updatedGoal);
  } catch (e) {
    res.send(e);
  }
};

module.exports.getAllGoalsByOwnerId = async (req, res) => {
  const userId = req.params.userId;
  console.log("userId: ", userId);

  const getUserGoals = await Goal.find({ userId });

  Task.populate(getUserGoals, { path: "goalTasks", model: "Task" }, function(
    err,
    goals
  ) {
    const goalsId = goals.map(goal => goal._id);

    Task.find(
      {
        goalId: { $in: goalsId }
      },
      function(err, tasks) {
        res.json({
          success: true,
          message: `User has some Goals`,
          data: goals,
          tasks: tasks
        });
      }
    );

    if (getUserGoals.length === 0) {
      res.status(404).json({
        success: false,
        message: `This User don't have any Goals`
      });
    }
  });
};
