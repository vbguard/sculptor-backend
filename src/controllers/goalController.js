const Goal = require("../models/goalModel.js");
const Task = require("../models/taskModel.js");
const async = require("async");

module.exports.createNewGoal = async (req, res) => {
  /*
   * TODO:
   *  - goalTitle: String
   *  - goalMotivation: String
   *  - goalNumber: Number
   *  - goalTasks: [Task=>ref - save objectId]
   *  - goalColor: String
   *  - goalCompleted: Boolean, default: false
   *  - ownerId: String, required: true
   */

  const data = req.body.data;
  const ownerId = req.body.userId;

  //Створюємо новий документ ( Goal - Ціль )
  const newGoal = await new Goal({
    goalTitle: data.goalTitle,
    goalNumber: data.goalNumber,
    goalMotivation: data.goalMotivation,
    goalColor: data.goalColor,
    ownerId
  });

  const goalId = newGoal._id;

  data.goalTasks = data.goalTasks.map(task => {
    return { ...task, goalId, taskColor: data.goalColor };
  });

  // .insertMany - метод для створення багато документів у відповідній колекції
  // приймає першим параметром масив або об'єкт данних «Array|Object|*»
  await Task.insertMany(data.goalTasks, (err, docs) => {
    newGoal.goalTasks = [...docs.map(task => task._id)];
    newGoal.save((err, goal) => {
      if (err) console.log(err);
      res.json(goal);
    });
  });
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
  const goalId = req.body.goalId;
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
  const ownerId = req.params.userId;
  console.log("userId: ", ownerId);

  const getUserGoals = await Goal.find({ ownerId: ownerId });

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
        // Goal.populate(tasks, { path: _id, model: "Goal" }, (err, tasss) => {
        //   console.log(tasss);
        // });
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
