// import { Plan, Day } from "../models";
// const Plan = require("../models/Plan");
const Models = require("../models/index");
const Plan = Models.Plan;
const Day = Models.Day;

const daysController = {
  /* Get all Days of a single user. */
  getAllDays: (req, res) => {
    Day
      .find(
        {
          planID: req.body.planID
        }
      )
      .then(dbDays => {
        res.json(dbDays);
      })
      .catch(err => {
        res.json(err);
      })
  },

  /* Get a single day. */
  getDay: (req, res) => {
    Day
      .findById(req.params.id)
      .populate("fitnesses")
      .populate("foods")
      .then(dbDay => {
        res.json(dbDay);
      })
      .catch(err => {
        res.json(err);
      })
  },

  /* Create(POST) a Day. */
  createDay: (req, res) => {
    const {day, userID, planID} = req.body;
    Day
      .create(
        {
          day: day,
          userID: userID,
          planID: planID
        }
      )
      .then(({ _id }) => Plan.findOneAndUpdate(
        { _id: planID }, 
        { $push: { days: _id } }
        )
      )
      .then(dbDay => {
        res.json(dbDay);
      })
      .catch(err => {
        res.json(err);
      })
  },

  /* Delete a day. */
  deleteDay: (req, res) => {
    Day
    .findOneAndDelete(
      { _id: req.params.id }
    )
    .then(dbDay => {
      res.json(dbDay);
    })
    .catch(err => {
      res.json(err);
    })
  }
};

// export default daysController;
module.exports = daysController;