const mongoose = require("mongoose");
const Fitness = require("./Fitness");
const Food = require("./Food");

const Schema = mongoose.Schema;

const DaySchema = new Schema(
  {
    day: {
      type: Number,
      required: "Day is required to be entered."
    },
    bodyWeight: {
      type: Number,
      default: 0
    },
    fitnesses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Fitness"
      }
    ],
    foods: [
      {
        type: Schema.Types.ObjectId,
        ref:"Food"
      }
    ],
    userID: {
      type: Schema.Types.ObjectId,
      required: "userID is required to be entered."
    },
    planID: {
      type: Schema.Types.ObjectId,
      required: "planID is required to be entered."
    }
  }
);

const Day = mongoose.model("Day", DaySchema);

module.exports = Day;