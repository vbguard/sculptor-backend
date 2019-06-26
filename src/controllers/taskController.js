const Goal = require("../models/goalModel.js");
const Task = require("../models/taskModel.js");

module.exports.getOneTask = async (req, res) => {
  const taskId = req.body.taskId;

  const getOneTask = Goal.find({ taskId });

  res.json(getOneTask);
};

module.exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const getTaskById = await Task.findById(taskId);

    if (getTaskById) {
      console.log(getTaskById);
    }
    const deleteTask = await Task.findByIdAndDelete(taskId);

    const updateGoal = await Goal.findOneAndUpdate(
      { _id: getTaskById.goalId },
      { $pull: { goalTasks: taskId } },
      { new: true }
    );

    if (deleteTask && updateGoal) {
      res.status(202).json({
        message: "Task success remove, Goal updated",
        goal: updateGoal
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports.updateTask = async (req, res) => {
  const taskId = req.params.taskId;
  const fieldsToUpdate = req.body.fieldsToUpdate;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        $set: fieldsToUpdate
      },
      { new: true }
    );

    res.status(202).json(updatedTask);
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message
    });
  }
};

module.exports.updateTaskActiveDates = async (req, res) => {
  const taskId = req.params.taskId;
  const newActiveDates = await req.body.taskActiveDates.map(el => ({
    date: new Date(el.date).toISOString(),
    isDone: el.isDone
  }));

  try {
    const updateTaskActiveDays = await Task.findByIdAndUpdate(
      taskId,
      { $set: { taskActiveDates: newActiveDates } },
      {
        new: true,
        multi: true
      }
    );

    const setTaskIsComplete = updateTaskActiveDays.taskActiveDates.filter(
      day => !day.isDone
    );

    if (setTaskIsComplete.length > 0) {
      updateTaskActiveDays.isComplete = false;
      updateTaskActiveDays.save();
    }

    if (setTaskIsComplete.length === 0) {
      updateTaskActiveDays.isComplete = true;
      updateTaskActiveDays.save();
    }

    if (updateTaskActiveDays) {
      res.status(201).json({
        success: true,
        message: "Task success updated",
        updatedTask: updateTaskActiveDays
      });
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message
    });
  }
};
