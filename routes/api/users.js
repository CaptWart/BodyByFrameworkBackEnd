// import express from 'express';
// const router = express.Router();
// import userController from "../../controllers/userController";
const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

/* GET all users. Matches with "/api/users" */
router.get('/', userController.getAllUsers);
/* GET a single user by id. Matches with "/api/users/:id" */
router.get("/:id", userController.getUser);

// export default router;
module.exports = router;