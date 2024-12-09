const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} = require("../controllers.js/comments.controller");

router.get("/", verifyToken, getComments);
router.post("/", verifyToken, createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
