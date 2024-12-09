const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
  login,
  register,
  getAllUsers,
  getUserById,
} = require("../controllers.js/user.controller");

router.get("/allUsers", verifyToken, getAllUsers);
router.get("/:userId", verifyToken, getUserById);
router.post("/login", login);
router.post("/register", register);

module.exports = router;
