// import express from "express";
// const router = express.Router();
// import foodsController from "../../controllers/foodsController";
const express = require("express");
const router = express.Router();
const foodsController = require("../../controllers/foodsController");

/* GET all foods. Marches with "/api/foods" */
router.get("/", foodsController.getAllFoods);
/* GET a single food by id. Marches with "/api/foods/:id" */
router.get("/:id", foodsController.getFood);
/* POST a food(workout). Matches with "/api/foods" */
router.post("/", foodsController.createFood);
/* PUT a food. Matches with "/api/foods/:id" */
router.put("/:id", foodsController.updateFood);
/* DELETE a food. Matches with "/api/foods/:id" */
router.delete("/:id", foodsController.deleteFood);

// export default router;
module.exports = router;