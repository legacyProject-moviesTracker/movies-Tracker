import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Comments({ movieId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch comments and decode the user's token on component mount
  useEffect(() => {
    async function fetchComments() {
      try {
        // Fetch comments for the specific movie
        const res = await axios.get("http://localhost:8080/comments", {
          params: { movieId }, // Pass movieId as a query parameter
        });
        console.log(res.data);
        setComments(res.data);

        // Decode the user's token to get their user ID
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setCurrentUserId(decoded.id);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    }

    fetchComments();
  }, [movieId]); // Dependency array includes movieId

  // Handle submitting a new comment
  async function handleAddComment(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);

      const newCommentData = {
        commentText: newComment,
        username: decoded.username, // Add user ID from token
        movieId,
      };

      const res = await axios.post(
        "http://localhost:8080/comments/",
        newCommentData,
        { new: true }
      );
      console.log(res);
      setComments([...comments, res.data.comment]); // Add new comment to the state
      // console.log(comments);
      setNewComment(""); // Clear the input field
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  }

  // Handle deleting a comment
  async function handleDeleteComment(commentId) {
    try {
      await axios.delete(`http://localhost:8080/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  }

  // Handle editing a comment
  async function handleEditComment(commentId, updatedText) {
    try {
      const res = await axios.put(
        `http://localhost:8080/comments/${commentId}`,
        { commentText: updatedText }
      );
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, commentText: res.data.commentText }
            : comment
        )
      );
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  }

  return (
    <div className="outerContainer">
      <h1 className="mb-4">Comments</h1>

      {/* New Comment Form */}
      <form onSubmit={handleAddComment} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            Add Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <ul className="list-group">
        {comments.map((comment) => (
          <li key={comment.id} className="list-group-item">
            <section style={{ backgroundColor: "#e7effd" }}>
              <div className="container my-5 py-5 text-body">
                <div className="row d-flex justify-content-center">
                  <div className="col-md-11 col-lg-9 col-xl-7">
                    <div className="d-flex flex-start mb-4">
                      <div className="card w-100">
                        <div className="textAndBtnContainer card-body p-4">
                          <div className="commentTextContainer">
                            {/* Username and Time */}
                            <h5>{comment.username}</h5>
                            <p className="small">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                            {/* Comment Text */}
                            <p>{comment.commentText}</p>
                          </div>

                          {/* Edit and Delete Buttons */}
                          {comment.userId === currentUserId && ( // Only show edit/delete buttons for the user's own comments
                            <div id="buttonsContainer">
                              <button
                                className="btn btn-sm btn-warning me-2"
                                style={{ backgroundColor: "green" }}
                                onClick={() => {
                                  const updatedText = prompt(
                                    "Edit your comment:",
                                    comment.commentText
                                  );
                                  if (updatedText) {
                                    handleEditComment(comment.id, updatedText);
                                  }
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                style={{ backgroundColor: "red" }}
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Comments;
