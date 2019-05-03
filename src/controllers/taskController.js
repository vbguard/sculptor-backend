const Goal = require("../models/goalModel.js");
const Task = require("../models/taskModel.js");

module.exports.getOneTask = async (req, res) => {
  const taskId = req.body.taskId;

  const getOneTask = Goal.find({ taskId });

  res.json(getOneTask);
};

module.exports.deleteTask = async (req, res) => {
  const taskId = req.body.taskId;
  const goalId = req.body.goalId;

  const deleteTask = await Task.findByIdAndDelete(taskId);
  const updateGoal = await Goal.findOneAndUpdate(
    { _id: goalId },
    { $pull: { goalTasks: taskId } }
  );

  if (deleteTask && updateGoal) {
    res.status(202).json({
      message: "Task success remove, Goal updated"
    });
  }
};

module.exports.updateTask = async (req, res) => {
  const taskId = req.body.taskId;
  const fieldsToUpdate = req.body.fieldsToUpdate;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: fieldsToUpdate },
      {
        new: true
      }
    );

    res.status(202).json(updatedTask);
  } catch (e) {
    res.send(e);
  }
};
