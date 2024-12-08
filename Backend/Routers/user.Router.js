const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
  login,
  register,
  getAllUsers,
} = require("../controllers.js/user.controller");

router.get("/allUsers", getAllUsers);
router.post("/login", login);
router.post("/register", register);

module.exports = router;
