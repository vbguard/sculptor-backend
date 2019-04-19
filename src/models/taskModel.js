const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  goalId: {
    type: String,
    required: true
  },
  taskTitle: {
    type: String,
    required: true,
    trim: true
  },
  taskColor: {
    type: String
  },
  taskWeekRange: {
    type: Array,
    default: [
      {
        week: 1,
        status: false
      },
      {
        week: 2,
        status: false
      },
      {
        week: 3,
        status: false
      },
      {
        week: 4,
        status: false
      },
      {
        week: 5,
        status: false
      },
      {
        week: 6,
        status: false
      },
      {
        week: 7,
        status: false
      },
      {
        week: 8,
        status: false
      },
      {
        week: 9,
        status: false
      }
    ]
  },
  taskCreateDate: {
    type: Date,
    default: Date.now()
  },
  taskActiveDates: [
    {
      date: {
        type: Date
      },
      isDone: {
        type: Boolean,
        default: false
      }
    }
  ],
  isComplete: {
    type: Boolean,
    default: false
  }
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
