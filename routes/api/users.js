const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

/* GET all users. Matches with "/api/users" */
router.get('/', userController.getAllUsers);
/* GET a single user by id. Matches with "/api/users/:id" */
router.get("/:id", userController.getUser);
/* DELETE a user. Matches with "/api/users/:id" */
router.delete("/:id", userController.deleteUser);

// export default router;
module.exports = router;