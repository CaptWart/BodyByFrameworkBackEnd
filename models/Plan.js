const mongoose = require('mongoose');
const Models = require("../models/index");
const UserModel = Models.UserModel;

const Schema = mongoose.Schema;

const PlanSchema = new Schema(
  {
    name: {
      type: String,
      required: "Name is required to be entered."
    },
    days: [
        {
            type: Schema.Types.ObjectId,
            ref: "Day"
        } 
    ],
    userID: {
      type: Schema.Types.ObjectId,
      required: "userID is required to be entered."
    }
  }
);

const Plan = mongoose.model("Plan", PlanSchema);

module.exports = Plan;