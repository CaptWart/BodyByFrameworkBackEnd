const Models = require("../models/index");
const UserModel = Models.UserModel;
const Plan = Models.Plan;
const Day = Models.Day;
const Fitness = Models.Fitness;
const Food = Models.Food;

const plansController = {
  /* Get all plans of a single user. */
  getAllPlans: (req, res) => {
    Plan
      .find(
        {
          userID: req.query.userID
        }
      )
      .populate("days")
      .then(dbPlans => {
        res.json(dbPlans);
      })
      .catch(err => {
        res.json(err);
      })
  },

  /* Get a single plan. */
  getPlan: (req, res) => {
    Plan
      .findById(req.params.id)
      .populate("days")
      .populate(
        { 
          path: "days",
          populate: {
            path: "fitnesses",
            model: "Fitness"
          } 
       }
      )
      .populate(
        { 
          path: "days",
          populate: {
            path: "foods",
            model: "Food"
          } 
       }
      )
      .then(dbPlan => {
        res.json(dbPlan);
      })
      .catch(err => {
        res.json(err);
      })
  },

  /* Create(POST) a plan. */
  createPlan: (req, res) => {
    const {name, userID} = req.body;
    Plan
      .create(
        {
          name: name,
          userID: userID
        }
      )
      .then(({ _id }) => UserModel.findOneAndUpdate(
        { _id: userID }, 
        { $push: { plans: _id } }
        )
      )
      .then(dbPlan => {
        res.json(dbPlan);
      })
      .catch(err => {
        res.json(err);
      })
  },

  /* Update(PUT) a plan(name). */
  updatePlan: (req, res) => {
    Plan
    .findOneAndUpdate(
      { _id: req.params.id }, 
      req.body
    )
    .then(dbPlan => {
      res.json(dbPlan);
    })
    .catch(err => {
      res.json(err);
    })
  },

  /* Delete a plan(name). */
  deletePlan: (req, res) => {
    const id = req.params.id;
    Promise.all([
      Fitness.deleteMany({planID: id}),
      Food.deleteMany({planID: id}),
      Day.deleteMany(({planID: id})),
      Plan.findOneAndDelete({_id: id}),
      UserModel.findOneAndUpdate( 
        {plans: { $in: id} },
        { $pull: { plans: id}}
      )
    ]).then(([fit, food, day, plan, user]) => {
      res.sendStatus(200);
    }).catch(e => next(e));
  }
};

module.exports = plansController;