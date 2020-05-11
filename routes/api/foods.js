const express = require("express");
const router = express.Router();
const foodsController = require("../../controllers/foodsController");

/* GET all foods. Marches with "/api/foods" */
router.get("/", foodsController.getAllFoods);
/* GET all foods by day. Marches with "/api/foods/day" */
router.get("/day", foodsController.getAllFoodsByDay);
/* GET a single food by id. Marches with "/api/foods/:id" */
router.get("/:id", foodsController.getFood);
/* POST a food(workout). Matches with "/api/foods" */
router.post("/", foodsController.createFood);
/* PUT a food. Matches with "/api/foods/:id" */
router.put("/:id", foodsController.updateFood);
/* DELETE a food. Matches with "/api/foods/:id" */
router.delete("/:id", foodsController.deleteFood);

module.exports = router;