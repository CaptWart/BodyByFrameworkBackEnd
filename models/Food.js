// import mongoose from "mongoose";
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FoodSchema = new Schema(
  {
    item: {
      type: String,
      required: "Item is required to be entered."
    },
    calories: {
      type: Number,
      required: "Calories is required to be entered."
    },
    price: {
      type: Number,
      required: "Price is required to be entered."
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

const Food = mongoose.model("Food", FoodSchema);

// export default Food;
module.exports = Food;