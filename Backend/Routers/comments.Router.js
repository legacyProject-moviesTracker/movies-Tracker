const express = require('express');
const router = express.Router();

const { 
    createComment, 
    updateComment, 
    deleteComment,
    getComments,
} = require('../controllers.js/comments.controller');

router.get('/comments', getComments)
router.post('/comments', createComment);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

module.exports = router;