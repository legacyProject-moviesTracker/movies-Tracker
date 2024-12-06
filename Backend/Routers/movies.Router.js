const express = require('express');

const {
    getAllMovies,
    addToFavorites,
    markAsWatched
} = require('../controllers.js/movie.controller');

const router = express.Router();

// Route to fetch all movies
router.get('/', getAllMovies);

// Route to add a movie to favorites
router.post('/favorites', addToFavorites);

// Route to mark a movie as watched
router.post('/watched', markAsWatched);

module.exports = router;