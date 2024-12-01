const Comment = require('../models/commentModel');
const MovieUser = require('../models/userModel');
const Movie = require('../models/movieModel');

// Get all comments by a specific user
const getCommentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all comments related to the userId
        const comments = await Comment.find({ userId });

        if (comments.length === 0) {
            return res.status(404).json({ message: "No comments found for this user" });
        }

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching comments" });
    }
};

// Get all comments for a specific movie
const getCommentsByMovie = async (req, res) => {
    try {
        const { movieId } = req.params;

        // Find all comments related to the movieId
        const comments = await Comment.find({ movieId });

        if (comments.length === 0) {
            return res.status(404).json({ message: "No comments found for this movie" });
        }

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching comments" });
    }
};

// Add a new comment
const addComment = async (req, res) => {
    try {
        const { userId, movieId, commentText } = req.body;

        // Check if the user and movie exist
        const user = await MovieUser.findById(userId);
        const movie = await Movie.findById(movieId);

        if (!user || !movie) {
            return res.status(404).json({ message: "User or Movie not found" });
        }

        // Create a new comment
        const newComment = new Comment({
            userId,
            movieId,
            commentText
        });

        // Save the comment to the database
        await newComment.save();

        res.status(201).json({
            message: 'Comment added successfully!',
            comment: newComment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding comment" });
    }
};

// Update an existing comment
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { commentText } = req.body;

        // Find the comment by ID and update it
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { commentText },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json({
            message: 'Comment updated successfully!',
            comment: updatedComment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating comment" });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the comment by ID and delete it
        const deletedComment = await Comment.findByIdAndDelete(id);

        if (!deletedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json({
            message: 'Comment deleted successfully!'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting comment" });
    }
};

module.exports = {
    addComment,
    updateComment,
    deleteComment,
    getCommentsByUser,
    getCommentsByMovie
};
