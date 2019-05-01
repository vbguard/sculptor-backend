const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskActiveSchema = new Schema(
  {
    date: {
      type: Date
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
