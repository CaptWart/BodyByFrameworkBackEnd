const express = require("express");
const router = express.Router();
const daysController = require("../../controllers/daysController");

/* GET all days of a plan. Matches with "/api/days" */
router.get('/', daysController.getAllDays);
/* GET a single day by id. Matches with "/api/days/:id" */
router.get("/id", daysController.getDay);
/* GET the last day (max day) of the plan. Marches with "/api/days/last" */
router.get("/last", daysController.getLastDay);
/* POST a day. Matches with "/api/days" */
router.post("/", daysController.createDay);
/* DELETE a day. Matches with "/api/days/:id" */
router.delete("/:id", daysController.deleteDay);

module.exports = router;