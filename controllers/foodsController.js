const Models = require("../models/index");
const Day = Models.Day;
const Food = Models.Food;

const foodsController = {
  /* Get all foods of a single plan. */
  getAllFoods: (req, res) => {
    Food
      .find(
        {
          planID: req.query.planID
        }
      )
      .then(dbFoods => {
        res.json(dbFoods);
      })
      .catch(err => {
        res.json(err);
      })
  },

  /* Get all foods of a single plan by day. */
  getAllFoodsByDay: (req, res) => {
    Food
      .find(
        {
          dayID: req.query.dayID
        }
      )
      .then(dbFoods => {
        res.json(dbFoods);
      })
      .catch(err => {
        res.json(err);
      })
  },

  /* Get a single food. */
  getFood: (req, res) => {
    Food
      .findById(req.params.id)
      .then(dbFood => {
        res.json(dbFood);
      })
      .catch(err => {
        res.json(err);
      })
  },

  /* Create(POST) a food. */
  createFood: (req, res) => {
    const {item, calories, price, userID, planID, dayID} = req.body;
    Food
      .create(
        {
          item: item,
          calories: calories,
          price: price,
          userID: userID,
          planID: planID,
          dayID: dayID
        }
      )
      .then(({ _id }) => Day.findOneAndUpdate(
        { _id: dayID }, 
        { $push: { foods: _id } }
        )
      )
      .then(dbFood => {
        res.json(dbFood);
      })
      .catch(err => {
        res.json(err);
      })
  },

  /* Update(PUT) a food. */
  updateFood: (req, res) => {
    const opts = { runValidators: true };
    Food
    .findOneAndUpdate(
      { _id: req.params.id }, 
      req.body,
      opts
    )
    .then(dbFood => {
      res.json(dbFood);
    })
    .catch(err => {
      res.json(err);
    })
  },

  /* Delete a food. */
  deleteFood: (req, res) => {
    const id = req.params.id;
    Food
    .findOneAndDelete(
      { _id: id }
    )
    .then(() => {
      Day
      .findOneAndUpdate( {foods: { $in: id} },
      { $pull: { foods: id}}, function(err, data){
        res.json(data)
      }) 
    })
    .catch(err => {
      res.json(err);
    })
  }
};

module.exports = foodsController;