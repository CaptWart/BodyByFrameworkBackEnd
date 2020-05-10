// import express from 'express';
// const router = express.Router();
// import daysController from "../../controllers/daysController";
const express = require("express");
const router = express.Router();
const daysController = require("../../controllers/daysController");

/* GET all days of a plan. Matches with "/api/days" */
router.get('/', daysController.getAllDays);
/* GET a single plan by id. Matches with "/api/days/:id" */
router.get("/:id", daysController.getDay);
/* POST a day. Matches with "/api/days" */
router.post("/", daysController.createDay);
/* DELETE a day. Matches with "/api/day/:id" */
router.delete("/:id", daysController.deleteDay);

// export default router;
module.exports = router;