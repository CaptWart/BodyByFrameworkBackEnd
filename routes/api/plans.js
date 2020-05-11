const express = require("express");
const router = express.Router();
const plansController = require("../../controllers/plansController");

var cors = require('cors')
var app = express()
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

/* GET all plans. Matches with "/api/plans" */
router.get('/', cors(corsOptions), plansController.getAllPlans);
/* GET a single lan by id. Matches with "/api/plans/:id" */
router.get("/:id", plansController.getPlan);
/* POST a plan. Matches with "/api/plans" */
router.post("/", plansController.createPlan);
/* PUT a plan. Matches with "/api/plans/:id" */
router.put("/:id", plansController.updatePlan);
/* DELETE a plan. Matches with "/api/plans/:id" */
router.delete("/:id", plansController.deletePlan);

module.exports = router;