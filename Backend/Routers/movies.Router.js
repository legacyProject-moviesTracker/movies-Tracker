const express = require('express');

const {
    getAllMovies,
    addFavoriteMovie,
    updateFavoriteMovie,
    deleteFavoriteMovie
} = require('../controllers.js/movie.controller');

const router = express.Router();

router.get('/', getAllMovies);
router.post('/favorites', addFavoriteMovie);
router.put('/favorites/:id', updateFavoriteMovie);
router.delete('/favorites/:id', deleteFavoriteMovie);

module.exports = router;