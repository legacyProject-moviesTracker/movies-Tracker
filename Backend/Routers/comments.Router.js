const express = require('express');
const router = express.Router();

const { 
    createComment, 
    updateComment, 
    deleteComment,
    getComments,
} = require('../controllers.js/comments.controller');

router.get('/', getComments)
router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;