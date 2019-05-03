const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskActiveSchema = require("./taskActiveModel");

const TaskSchema = new Schema(
  {
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
    taskActiveDates: {
      type: [TaskActiveSchema],
      default: []
    },
    isComplete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
