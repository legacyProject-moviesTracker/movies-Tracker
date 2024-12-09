const express = require("express");

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

router.get("/:userId", getAllMovies);
router.get("/allFavoriteMovies/:userId", getFavoriteMovies);
router.post("/favorites", addFavoriteMovie);
router.get("/allWatchedMovies/:userId", getWatchedMovies);
router.post("/watched", addMovieToWatched);
router.patch("/deleteFavorite/:id", deleteFavoriteMovie);
router.patch("/deleteWatchedMovie/:id", deleteWatchedMovie);
router.delete("/deleteMovieFromList/:id", deleteMovieFromList);
router.delete("/deleteAllList", deleteAllList);

module.exports = router;
