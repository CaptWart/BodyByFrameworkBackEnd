const Models = require("../models/index");
const Plan = Models.Plan;
const Day = Models.Day;
const Fitness = Models.Fitness;
const Food = Models.Food;

const daysController = {
  /* Get all Days of a single user. */
  getAllDays: (req, res) => {
    Day
      .find(
        {
          planID: req.query.planID
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
      .findOne({
        _id: req.query._id
      })
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
    const id = req.params.id;
    Day
    .findOneAndDelete(
      { _id: id }
    )
    .then(() => {
      Plan
      .findOneAndUpdate( {days: { $in: id} },
      { $pull: { days: id}}, function(err, data){
        res.json(data)
      });
      // Fitness
      // .deleteMany({dayID: id});
      // Food
      // .deleteMany({dayID: id});
      Fitness
      .remove({dayID: id});
      Food
      .remove({dayID: id});
    })
    .catch(err => {
      res.json(err);
    })
  },

  /* Get the last day (max day) of the plan */
  getLastDay: (req, res) => {
    Day
      .find(
        {
          planID: req.query.planID
        }
      )
      .select("day")
      .sort("-day")
      .limit(1)
      .then(dbDays => {
        res.json(dbDays);
      })
      .catch(err => {
        res.json(err);
      })
  },
};

module.exports = daysController;