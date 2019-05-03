const Task = require("../models/taskModel.js");
const TaskActive = require("../models/taskActiveModel.js");

module.exports.deleteTaskActive = async (res, req) => {
  const taskId = req.body.taskId;
  const taskActiveId = req.body.taskActiveId;

  const deleteTask = await TaskActive.findByIdAndDelete(taskActiveId);
  const updateGoal = await Task.findOneAndUpdate(
    { _id: taskId },
    { $pull: { taskActiveDates: taskId } }
  );

  if (deleteTask && updateGoal) {
    res.status(202).json({
      message: "TaskActive success remove, Task updated"
    });
  }
};

module.exports.updateTaskActive = async (res, req) => {
  const taskId = req.body.taskActiveId;
  const fieldsToUpdate = req.body.fieldsToUpdate;

  try {
    const updatedTaskActive = await TaskActive.findByIdAndUpdate(
      taskActiveId,
      { $set: fieldsToUpdate },
      {
        new: true
      }
    );

    res.status(202).json(updatedTaskActive);
  } catch (e) {
    res.send(e);
  }
};
