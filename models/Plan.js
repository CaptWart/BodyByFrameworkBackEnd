// import mongoose from 'mongoose';
// import { UserModel } from "../models";
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
      // ref: "User",
      required: "userID is required to be entered."
    }
  }
);

// PlanSchema.pre("findOneAndDelete", function(doc) {
//   const planID = doc._id;
//   User
//       .find({ plans: { $in: [planID] } })
//       .then((users) => {
//         Promise.all(
//           users.map(user =>
//             User.findOneAndUpdate(
//               user._id,
//               { $pull: { roles: planID } },
//               { new: true }
//             )
//           )
//         )
//       });
// });

const Plan = mongoose.model("Plan", PlanSchema);

module.exports = Plan;