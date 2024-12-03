const express = require('express');
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
} = require('../controllers.js/user.controller');

router.get('/user/favorites/:id', verifyToken, getFavoritesWithDetails);
router.get('/user/watchlist/:id', verifyToken, getWatchlist);
router.post('/user/favorites', verifyToken, addFavoriteMovie);
router.post('/user/watchlist', verifyToken, addToWatchlist);
router.delete('/user/favorite', verifyToken, deleteFavorite);
router.delete('/user/watchlist', verifyToken, deleteWatchedMovie);
router.post('/login', login);
router.post('/register', register);

module.exports = router;