const Task = require("../models/taskModel.js");

module.exports.deleteTaskActiveDay = (req, res) => {
  const taskId = req.params.taskId;
  const taskActiveDayId = req.body.taskActiveDayId;

  Task.update(
    { _id: taskId },
    {
      $pull: {
        taskActiveDates: { _id: taskActiveDayId }
      }
    },
    { multi: true },
    (err, updatedTask) => {
      if (err) {
        es.status(404).json({
          success: false,
          message: err.message
        });
      }

      res.status(201).json({
        message: "TaskActive success remove, Task updated",
        updatedTask: updatedTask
      });
    }
  );
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
      arrayFilters: [{ "elem._id": taskActiveDayId }]
    }
  );

  if (changeStatusActiveDayInTask) {
    res.status(201).json({
      message: "TaskActive success updated, Task updated",
      updatedTask: changeStatusActiveDayInTask
    });
  }
};
