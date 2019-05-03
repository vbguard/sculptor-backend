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

module.exports = TaskActiveSchema;
