const Goal = require("../models/goalModel.js");

module.exports.createNewGoal = (req, res) => {
  //   {
  //     "goalTitle": "My first goal",
  //     "goalDescription": "Bla bla we must created new GOAL",
  //     "goalNumber": 1,
  //     "goalColor": 424242
  // }
  const newGoal = new Goal(req.body);

  newGoal.save((err, goal) => {
    if (err) console.log(err);
    res.json(goal);
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

module.exports.getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find({});
    res.send(goals);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.updateGoal = async (req, res) => {
  const goalId = req.body.goalId;

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(req.body.id, req.body, {
      new: true
    });
    res.status(202).send(updatedGoal);
  } catch (e) {
    res.send(e);
  }
};

module.exports.getAllGoalsByOwnerId = async (req, res) => {
  // "_id": "5cb58d3bc12e6785d2c02b65"
  const ownerId = req.body.ownerId;
  console.log(req.decoded.user);

  const getUserGoals = await Goal.find({ ownerId: ownerId });

  const messageNotDocument = `This user don't create any Goals`;
  const messageHaveDocument = `This user have some Goals`;

  res.json({
    success: true,
    message: getUserGoals ? messageHaveDocument : messageNotDocument,
    data: getUserGoals
  });
};
