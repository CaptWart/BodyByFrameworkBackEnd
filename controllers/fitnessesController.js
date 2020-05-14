const Models = require("../models/index");
const Day = Models.Day;
const Fitness = Models.Fitness;

const fitnessesController = {
  /* Get all fitnesses of a single plan. */
  getAllFitnesses: (req, res) => {
    Fitness
      .find(
        {
          // planID: req.body.planID
          planID: req.query.planID
        }
      )
      .then(dbFitnesses => {
        res.json(dbFitnesses);
      })
      .catch(err => {
        res.json(err);
      })
  },

  /* Get all fitnesses of a single plan by day. */
  getAllFitnessesByDay: (req, res) => {
    Fitness
      .find(
        {
          dayID: req.query.dayID
        }
      )
      .then(dbFitnesses => {
        res.json(dbFitnesses);
      })
      .catch(err => {
        res.json(err);
      })
  },

  /* Get a single fitness. */
  getFitness: (req, res) => {
    Fitness
      .findById(req.params.id)
      .then(dbFitness => {
        res.json(dbFitness);
      })
      .catch(err => {
        res.json(err);
      })
  },

  /* Create(POST) a fitness. */
  createFitness: (req, res) => {
    const {workout, weight, sets, reps, time, userID, planID, dayID} = req.body;
    Fitness
      .create(
        {
          workout: workout,
          weight: weight,
          sets: sets,
          reps: reps,
          time: time,
          userID: userID,
          planID: planID,
          dayID: dayID
        }
      )
      .then(({ _id }) => Day.findOneAndUpdate(
        { _id: dayID }, 
        { $push: { fitnesses: _id } }
        )
      )
      .then(dbPlan => {
        res.json(dbPlan);
      })
      .catch(err => {
        res.json(err);
      })
  },

  /* Update(PUT) a fitness. */
  updateFitness: (req, res) => {
    Fitness
    .findOneAndUpdate(
      { _id: req.params.id }, 
      req.body
    )
    .then(dbFitness => {
      res.json(dbFitness);
    })
    .catch(err => {
      res.json(err);
    })
  },

  /* Delete a fitness. */
  deleteFitness: (req, res) => {
    const id = req.params.id;
    Fitness
    .findOneAndDelete(
      { _id: id }
    )
    .then(() => {
      Day
      .findOneAndUpdate( {fitnesses: { $in: id} },
      { $pull: { fitnesses: id}}, function(err, data){
        res.json(data)
      }) 
    })
    .catch(err => {
      res.json(err);
    })
  }
};

module.exports = fitnessesController;