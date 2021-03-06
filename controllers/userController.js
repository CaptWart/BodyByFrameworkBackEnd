const Models = require("../models/index");
const UserModel = Models.UserModel;
const Plan = Models.Plan;
const Day = Models.Day;
const Fitness = Models.Fitness;
const Food = Models.Food;

const userController = {
  getAllUsers: (req, res) => {
    UserModel
      .find({})
      .then(dbUsers => {
        res.json(dbUsers);
      })
      .catch(err => {
        res.json(err);
      })
  },

  getUser: (req, res) => {
    UserModel
      .findById(req.params.id)
      .populate("plans")
      .populate(
        { 
          path: "plans",
          populate: {
            path: "days",
            model: "Day"
          } 
       }
      )
      .populate(
        { 
          path: "plans",
          populate: {
            path: "days",
            populate: {
              path: "fitnesses",
              model: "Fitness"
            }
          } 
       }
      )
      .populate(
        { 
          path: "plans",
          populate: {
            path: "days",
            populate: {
              path: "foods",
              model: "Food"
            }
          } 
       }
      )
      .then(dbUser => {
        res.json(dbUser);
      })
      .catch(err => {
        res.json(err);
      })
  }
};

module.exports = userController;