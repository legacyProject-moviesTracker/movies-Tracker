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
} = require("../controllers.js/movie.controller");

const router = express.Router();

router.get("/", getAllMovies);
router.get("/allFavoriteMovies", getFavoriteMovies);
router.post("/favorites", addFavoriteMovie);
router.get("/allWatchedMovies", getWatchedMovies);
router.post("/watched", addMovieToWatched);
router.patch("/deleteFavorite/:id", deleteFavoriteMovie);
router.patch("/deleteWatchedMovie/:id", deleteWatchedMovie);
router.delete("/deleteMovieFromList/:id", deleteMovieFromList);

module.exports = router;
