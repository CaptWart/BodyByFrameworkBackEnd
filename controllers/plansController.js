// import { User, Plan } from '../models';
const Models = require("../models/index");
const UserModel = Models.UserModel;
const Plan = Models.Plan;

const plansController = {
  /* Get all plans of a single user. */
  getAllPlans: (req, res) => {
    Plan
      .find(
        {
          userID: req.body.userID
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
    Plan
    .findOneAndDelete(
      { _id: req.params.id }
    )
    .then(({ _id }) => {
      const planID = _id;
      UserModel // Not working...
        .find({ plans: { $in: [planID] } })
        .then((users) => {
          Promise.all(
            users.map(user =>
              User.findOneAndUpdate(
                user._id,
                { $pull: { plans: planID } },
                { new: true }
              )
            )
          )
        });
      })
    .then(dbPlan => {
      res.json(dbPlan);
    })
    .catch(err => {
      res.json(err);
    })
  }
};

// export default plansController;
module.exports = plansController;