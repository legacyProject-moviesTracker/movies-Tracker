const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
  login,
  register,
} = require("../controllers.js/user.controller");


router.post("/login", login);
router.post("/register", register);

module.exports = router;
