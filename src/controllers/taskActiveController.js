const Task = require("../models/taskModel.js");

module.exports.deleteTaskActiveDay = async (res, req) => {
  const taskId = req.params.taskId;
  const taskActiveDayId = req.body.taskActiveDayId;

  const deleteActiveDayInTask = await Task.findOneAndUpdate(
    { _id: taskId },
    { $pull: { _id: taskActiveDayId } }
  );

  if (deleteActiveDayInTask) {
    res.status(202).json({
      message: "TaskActive success remove, Task updated",
      updatedTask: deleteActiveDayInTask
    });
  }
};

module.exports.changeStatusTaskActiveDay = async (res, req) => {
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
    res.status(202).json({
      message: "TaskActive success updated, Task updated",
      updatedTask: changeStatusActiveDayInTask
    });
  }
};
