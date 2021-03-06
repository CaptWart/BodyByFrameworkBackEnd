const express = require("express");
const router = express.Router();
const plansController = require("../../controllers/plansController");

/* GET all plans. Matches with "/api/plans" */
// router.get('/', cors(corsOptions), plansController.getAllPlans);
router.get('/', plansController.getAllPlans);
/* GET a single lan by id. Matches with "/api/plans/:id" */
router.get("/:id", plansController.getPlan);
/* POST a plan. Matches with "/api/plans" */
router.post("/", plansController.createPlan);
/* PUT a plan. Matches with "/api/plans/:id" */
router.put("/:id", plansController.updatePlan);
/* DELETE a plan. Matches with "/api/plans/:id" */
router.delete("/:id", plansController.deletePlan);

module.exports = router;