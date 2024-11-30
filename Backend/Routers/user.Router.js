const express = require('express');

const {
    registerUser,
    loginUser,
    getFavoritesWithDetails,
} = require('../controllers.js/user.controller');

const router = express.Router();

router.get('/user/favorites/:id', getFavoritesWithDetails);
router.get('/user/watchlist');
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/user/favorites', );
router.post('/user/watchlist');
router.delete('/user/favorite');
router.delete('/user/watchlist');

module.exports = router;