const Task = require("../models/taskModel.js");

module.exports.deleteTaskActiveDay = async (req, res) => {
  const taskId = req.params.taskId;
  const taskActiveDayId = req.body.taskActiveDayId;
  try {
    const updateTask = await Task.findOneAndUpdate(
      { _id: taskId },
      {
        $pull: {
          taskActiveDates: { _id: taskActiveDayId }
        }
      },
      { multi: true, new: true }
    );

    const setTaskIsComplete = updateTask.taskActiveDates.filter(
      day => !day.isDone
    );

    if (setTaskIsComplete.length > 0) {
      updateTask.isComplete = false;
      updateTask.save();
    }

    if (setTaskIsComplete.length === 0) {
      updateTask.isComplete = true;
      updateTask.save();
    }

    if (updateTask) {
      res.status(201).json({
        success: true,
        message: "TaskActive success updated, Task updated",
        updatedTask: updateTask
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

module.exports.changeStatusTaskActiveDay = async (req, res) => {
  const taskId = req.params.taskId;
  const taskActiveDayId = req.body.taskActiveDayId;
  const isDone = req.body.isDone;

  const changeStatusActiveDayInTask = await Task.findOneAndUpdate(
    { _id: taskId },
    { $set: { "taskActiveDates.$[elem].isDone": isDone } },
    {
      multi: true,
      new: true,
      arrayFilters: [{ "elem._id": taskActiveDayId }]
    }
  );

  const setTaskIsComplete = changeStatusActiveDayInTask.taskActiveDates.filter(
    day => !day.isDone
  );

  if (setTaskIsComplete.length > 0) {
    changeStatusActiveDayInTask.isComplete = false;
    changeStatusActiveDayInTask.save();
  }

  if (setTaskIsComplete.length === 0) {
    changeStatusActiveDayInTask.isComplete = true;
    changeStatusActiveDayInTask.save();
  }

  if (changeStatusActiveDayInTask) {
    res.status(201).json({
      message: "TaskActive success updated, Task updated",
      updatedTask: changeStatusActiveDayInTask
    });
  }
};
