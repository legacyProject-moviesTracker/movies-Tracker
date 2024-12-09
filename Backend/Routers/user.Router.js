const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
  login,
  register,
  getAllUsers,
  getUserById,
  updateUser,
} = require("../controllers.js/user.controller");

router.get("/allUsers", getAllUsers);
router.get("/:userId", getUserById);
router.post("/login", login);
router.post("/register", register);

router.put("/:userId", updateUser); 

module.exports = router;
