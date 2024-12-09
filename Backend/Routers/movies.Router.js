const express = require("express");
const verifyToken = require("../middleware/auth");

const {
  getAllMovies,
  getWatchedMovies,
  getFavoriteMovies,
  addFavoriteMovie,
  addMovieToWatched,
  deleteFavoriteMovie,
  deleteWatchedMovie,
  deleteMovieFromList,
  deleteAllList,
} = require("../controllers.js/movie.controller");

const router = express.Router();

router.get("/:userId", verifyToken, getAllMovies);
router.get("/allFavoriteMovies/:userId", verifyToken, getFavoriteMovies);
router.post("/favorites", verifyToken, addFavoriteMovie);
router.get("/allWatchedMovies/:userId", verifyToken, getWatchedMovies);
router.post("/watched", verifyToken, addMovieToWatched);
router.patch("/deleteFavorite/:id", verifyToken, deleteFavoriteMovie);
router.patch("/deleteWatchedMovie/:id", verifyToken, deleteWatchedMovie);
router.delete("/deleteMovieFromList/:id", verifyToken, deleteMovieFromList);
router.delete("/deleteAllList", verifyToken, deleteAllList);

module.exports = router;
