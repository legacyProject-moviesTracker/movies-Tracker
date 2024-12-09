const Comment = require("../models/commentsModel");
const User = require("../models/userModel");
const Movie = require("../models/moviesModel");
require("dotenv").config();
const axios = require("axios");

const createComment = async (req, res) => {
  const { username, movieId, commentText } = req.body;
  const userId = req.user._id;
  // console.log(userId);
  // Validate required fields
  if (!commentText) {
    return res.status(400).json({
      error: "Comment is required!",
    });
  }

  try {
    // Validate userId and movieId existence
    const userExists = await User.findOne({ username });
    const movieExists = await Movie.findById(movieId);
    if (!userExists || !movieExists) {
      return res.status(404).json({ error: "User or Movie not found" });
    }

    // Create and save new comment
    const newComment = new Comment({ username, movieId, commentText, userId });
    await newComment.save();
    // console.log(newComment);
    res.status(201).json({
      message: "Comment added successfully!",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

const updateComment = async (req, res) => {
  const { id } = req.params; // Get the comment ID from the URL parameter
  const { commentText } = req.body; // Get the updated comment text from the request body

  try {
    // Update the comment text and return the updated document
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { commentText },
      { new: true } // Return the updated document
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({
      message: "Comment updated successfully!",
      comment: updatedComment, // Send the updated comment object
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment." });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params; // Get the comment ID from the URL parameter
  // const userId = req.user._id;
  // console.log(userId);

  try {
    // Find the comment by its ID and delete it
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment." });
  }
};

const getComments = async (req, res) => {
  try {
    const { movieId } = req.query; // Get movieId from query parameters
    // const userId = req.user._id;
    // console.log(userId);

    // Fetch comments filtered by movieId
    const query = movieId ? { movieId } : {}; // If movieId is provided, filter by it
    const comments = await Comment.find(query).sort({ createdAt: -1 }); // Sort by most recent

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getComments,
};
