const express = require('express');

const {
    registerUser,
    loginUser,
    getFavoritesWithDetails,
    addFavoriteMovie,
    addToWatchlist,
    getWatchlist,
    deleteFavorite,
    deleteWatchedMovie,
    createComments,
} = require('../controllers.js/user.controller');

const router = express.Router();

router.get('/user/favorites/:id', getFavoritesWithDetails);
router.get('/user/watchlist/:id', getWatchlist);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/user/favorites', addFavoriteMovie);
router.post('/user/watchlist', addToWatchlist);
router.delete('/user/favorite', deleteFavorite);
router.delete('/user/watchlist', deleteWatchedMovie);
router.post('/user/comments', createComments);

module.exports = router;