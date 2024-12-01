const express = require('express');
const router = express.Router();

const {
    addComment,
    updateComment,
    deleteComment
} = require('../controllers/comment.controller');

router.get('/movie/:movieId', getCommentsByMovie);
router.get('/user/:userId', getCommentsByUser);
router.post('/add', addComment);
router.put('/update/:id', updateComment);
router.delete('/delete/:id', deleteComment);

module.exports = router;
