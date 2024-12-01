const Comment = require('../models/commentsModel');
const MovieUser = require('../models/userModel');
const Movie = require('../models/moviesModel');
require('dotenv').config();
const axios = require('axios');

const createComment = async (req, res) => {
    const { userId, movieId, commentText } = req.body;
    
    try {
        const newComment = new Comment({
            userId,
            movieId,
            commentText
        });

        await newComment.save();
        res.status(201).json({ message: 'Comment added successfully!' });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment.' });
    }
};

const updateComment = async (req, res) => {
    const { id } = req.params; // Get the comment ID from the URL parameter
    const { commentText } = req.body; // Get the updated comment text from the request body

    try {
        // Find the comment by its ID
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Update the comment text
        comment.commentText = commentText || comment.commentText;

        // Save the updated comment
        await comment.save();

        res.status(200).json({ message: 'Comment updated successfully!', comment });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Failed to update comment.' });
    }
};

const deleteComment = async (req, res) => {
    const { id } = req.params; // Get the comment ID from the URL parameter

    try {
        // Find the comment by its ID and delete it
        const comment = await Comment.findByIdAndDelete(id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment.' });
    }
};

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments.' });
    }
};

module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getComments,
}