const Goal = require("../models/goalModel.js");

module.exports.getOneTask = async (req, res) => {
  const taskId = req.body.taskId;

  const getOneTask = Goal.find({ taskId });

  res.json(getOneTask);
};
