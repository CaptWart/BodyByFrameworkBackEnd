// import mongoose from "mongoose";
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FitnessSchema = new Schema(
  {
    workout: {
      type: String,
      required: "Workout is required to be entered."
    },
    weight: {
      type: Number,
      default: 0
    },
    sets: {
      type: Number,
      default: 0
    },
    reps: {
      type: Number,
      default: 0
    },
    time: {
      type: Number,
      default: 0
    },
    userID: {
      type: Schema.Types.ObjectId,
      required: "userID is required to be entered."
    },
    planID: {
      type: Schema.Types.ObjectId,
      required: "planID is required to be entered."
    },
    dayID: {
      type: Schema.Types.ObjectId,
      required: "dayID is required to be entered."
    }  
  }
);

const Fitness = mongoose.model("Fitness", FitnessSchema);

// export default Fitness;
module.exports = Fitness;