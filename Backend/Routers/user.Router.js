const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
  getFavoritesWithDetails,
  addFavoriteMovie,
  addToWatchlist,
  getWatchlist,
  deleteFavorite,
  deleteWatchedMovie,
  login,
  register,
} = require("../controllers.js/user.controller");

router.get("/favorites/:id", verifyToken, getFavoritesWithDetails);
router.get("/watchlist/:id", verifyToken, getWatchlist);
router.post("/favorites", verifyToken, addFavoriteMovie);
router.post("/watchlist", verifyToken, addToWatchlist);
router.delete("/favorite", verifyToken, deleteFavorite);
router.delete("/watchlist", verifyToken, deleteWatchedMovie);
router.post("/login", login);
router.post("/register", register);

module.exports = router;
