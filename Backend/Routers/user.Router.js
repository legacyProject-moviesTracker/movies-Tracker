const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    getFavoritesWithDetails,
    addFavoriteMovie,
    addToWatchlist,
    getWatchlist,
    deleteFavorite,
    deleteWatchedMovie,
} = require('../controllers.js/user.controller');

router.get('/user/favorites/:id', getFavoritesWithDetails);
router.get('/user/watchlist/:id', getWatchlist);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/user/favorites', addFavoriteMovie);
router.post('/user/watchlist', addToWatchlist);
router.delete('/user/favorite', deleteFavorite);
router.delete('/user/watchlist', deleteWatchedMovie);

module.exports = router;