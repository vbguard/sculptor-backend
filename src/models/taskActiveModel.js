const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskActiveSchema = new Schema(
  {
    taskId: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    isDone: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const TaskActive = mongoose.model("TaskActive", TaskActiveSchema);

module.exports = TaskActive;
