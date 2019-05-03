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
    type: String,
    required: true,
    default: "#c4f6cd",
    enum: [
      "#dee5e8",
      "#ffe7d4",
      "#f9c1ce",
      "#cbe3f7",
      "#9df1e4",
      "#fff2b5",
      "#f8d9f3",
      "#dbc9f8",
      "#c4f6cd",
      "#b9f7fe"
    ]
  },
  goalCompleted: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: true
  }
});

const Goal = mongoose.model("Goal", GoalSchema);

module.exports = Goal;
