// import mongoose from 'mongoose';
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

// Not working...
// DaySchema.pre("findOneAndDelete", function(next) {
//   Fitness.deleteMany({dayID: this._id});
//   Food.deleteMany({dayID: this._id}).exec();
//   next();
// });

const Day = mongoose.model("Day", DaySchema);

module.exports = Day;