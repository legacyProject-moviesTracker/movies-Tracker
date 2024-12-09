import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Comments({ movieId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  // Decode the user's token to get their user ID
  const token = localStorage.getItem("token");

  // Fetch comments and decode the user's token on component mount
  useEffect(() => {
    async function fetchComments() {
      try {
        // Fetch comments for the specific movie
        const res = await axios.get("http://localhost:8080/comments", {
          params: { movieId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // Pass movieId as a query parameter
        });
        // console.log(res.data);
        setComments(res.data);

        if (token) {
          const decoded = jwtDecode(token);
          setCurrentUserId(decoded.userId);
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
        {
          new: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      await axios.delete(`http://localhost:8080/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  }

  // Handle editing a comment
  // Handle editing a comment
  async function handleEditComment(commentId, updatedText) {
    try {
      const res = await axios.put(
        `http://localhost:8080/comments/${commentId}`,
        {
          commentText: updatedText,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedComment = res.data.comment;

      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, commentText: updatedComment.commentText }
            : comment
        )
      );
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  }

  return (
    <div
      className="outerContainer"
      style={{
        margin: "0",
        padding: "0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "end",
      }}
    >
      {/* New Comment Form */}
      <form onSubmit={handleAddComment}>
        <div
          className="input-group"
          style={{
            width: "165px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            style={{ width: "255px" }}
          />
          <button type="submit" className="btn btn-primary">
            Add Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <ul
        className="list-group"
        style={{
          margin: "5px",
          padding: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {comments.map((comment) => (
          <ol
            key={comment._id}
            className="list-group-item"
            style={{
              margin: "5px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              borderRadius: "20px",
              border: "1px solid black",
            }}
          >
            <section
              style={{
                // backgroundColor: "#e7effd",
                padding: "0",
                margin: "0",
                color: "black",
              }}
            >
              <div className="container ">
                <div className="row d-flex justify-content-center">
                  <div className="col-md-11 col-lg-9 col-xl-7">
                    <div
                      className="card"
                      style={{ width: "100%", display: "flex" }}
                    >
                      <div
                        className="textAndBtnContainer card-body"
                        style={{
                          width: "100%",
                          padding: "1px",
                          margin: "5px",
                        }}
                      >
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
                          <div
                            id="buttonsContainer"
                            // style={{ display: "flex", gap: "5px" }}
                          >
                            <button
                              // className="btn-warning"
                              style={{
                                backgroundColor: "green",
                                marginBottom: "5px",
                                marginRight: "5px",
                                borderRadius: "5px",
                              }}
                              onClick={() => {
                                const updatedText = prompt(
                                  "Edit your comment:",
                                  comment.commentText
                                );
                                if (updatedText) {
                                  handleEditComment(comment._id, updatedText);
                                }
                              }}
                            >
                              Edit
                            </button>
                            <button
                              // className="btn-danger"
                              style={{
                                backgroundColor: "red",
                                marginBottom: "5px",
                                marginRight: "5px",
                                borderRadius: "5px",
                              }}
                              onClick={() => handleDeleteComment(comment._id)}
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
            </section>
          </ol>
        ))}
      </ul>
    </div>
  );
}

export default Comments;
