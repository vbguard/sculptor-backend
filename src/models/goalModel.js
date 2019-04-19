const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TasksSchema = require("./taskModel.js");

const GoalSchema = new Schema({
  goalTitle: {
    type: String,
    required: true,
    trim: true
  },
  goalMotivation: {
    type: String,
    trim: true
  },
  goalNumber: {
    type: Number,
    default: 1,
    trim: true
  },
  goalTasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task"
    }
  ],
  goalColor: {
    type: String
  },
  goalCompleted: {
    type: Boolean,
    default: false
  },
  ownerId: {
    type: String,
    required: true
  }
});

const Goal = mongoose.model("Goal", GoalSchema);

module.exports = Goal;
