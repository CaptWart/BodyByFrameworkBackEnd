// import express from "express";
// const router = express.Router();
// import fitnessesController from "../../controllers/fitnessesController";
const express = require("express");
const router = express.Router();
const fitnessesController = require("../../controllers/fitnessesController");

/* GET all fitnesses. Marches with "/api/fitnesses" */
router.get("/", fitnessesController.getAllFitnesses);
/* GET a single fitness by id. Marches with "/api/fitnesses/:id" */
router.get("/:id", fitnessesController.getFitness);
/* POST a fitness(workout). Matches with "/api/fitnesses" */
router.post("/", fitnessesController.createFitness);
/* PUT a fitness. Matches with "/api/fitnesses/:id" */
router.put("/:id", fitnessesController.updateFitness);
/* DELETE a fitness. Matches with "/api/fitnesses/:id" */
router.delete("/:id", fitnessesController.deleteFitness);

// export default router;
module.exports = router;