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
            goals: goalTask
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
        goal: goal
      });
    });
  }
};

module.exports.deleteGoal = async (req, res) => {
  try {
    const goalId = req.params.goalId;

    const goalToDelete = await Goal.findByIdAndDelete(goalId);

    res.status(200).json({
      success: true,
      message: `Goal by id: ${goalToDelete._id}, successful delete`
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message
    });
  }
};

module.exports.updateGoal = (req, res) => {
  const goalId = req.params.goalId;
  const fieldsToUpdate = req.body;
  /**
   * TODO:
   * GOAL UPDATE
   ** - якщо є поле goalFieldsUpdate - оновити поля у цілі
   *? - якщо є поле tasks - оновити поля у тасків по їхніх ID
   *! - якщо  є поле newTasks - створити нові таски і !!! записати їх у цю ціль !!!
   */

  if (!!fieldsToUpdate.goalFieldsUpdate) {
    Goal.findByIdAndUpdate(
      goalId,
      { $set: fieldsToUpdate.goalFieldsUpdate },
      (err, updatedGoal) => {
        if (err) {
          res.status(401).json({
            success: false,
            in: "Goal Update",
            message: err.message
          });
        }
      }
    );
  }

  if (!!fieldsToUpdate.tasks) {
    for (var i = 0, l = fieldsToUpdate.tasks.length; i < l; i++) {
      Task.findByIdAndUpdate(
        { _id: fieldsToUpdate.tasks[i].taskId },
        { $set: fieldsToUpdate.tasks[i].updateFields },
        function(err, records) {
          if (err) {
            res.status(401).json({
              success: false,
              in: "Task Update",
              message: err.message
            });
          }
        }
      );
    }
  }

  if (!!fieldsToUpdate.newTasks) {
    Task.insertMany(fieldsToUpdate.newTasks, (err, newTasks) => {
      if (err) {
        res.status(401).json({
          success: false,
          in: "Task Update",
          message: err.message
        });
      }

      const newTasksId = [...newTasks.map(task => task._id)];

      Goal.updateOne(
        { _id: goalId },
        { $push: { goalTasks: newTasksId } },
        (err, addToGoalNewTasks) => {
          if (err) {
            res.status(401).json({
              success: false,
              in: "Task Update",
              message: err.message
            });
          }
          console.log(addToGoalNewTasks);
        }
      );
    });
  }

  setTimeout(() => {
    Goal.find({ userId: req.user._id }, (err, getUserGoals) => {
      Task.populate(
        getUserGoals,
        { path: "goalTasks", model: "Task" },
        function(err, goals) {
          const goalsId = goals.map(goal => goal._id);

          Task.find(
            {
              goalId: { $in: goalsId }
            },
            function(err, tasks) {
              res.json({
                success: true,
                message: `Return updated Goals and Tasks`,
                goals: goals,
                tasks: tasks
              });
            }
          );
        }
      );
    });
  }, 1000);
};

module.exports.getAllGoalsByOwnerId = async (req, res) => {
  const userId = req.params.userId;

  const getUserGoals = await Goal.find({ userId: userId });

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
          goals: goals,
          tasks: tasks
        });
      }
    );

    if (getUserGoals.length === 0) {
      res.status(200).json({
        success: false,
        message: `This User don't have any Goals`,
        goals: [],
        tasks: []
      });
    }
  });
};
