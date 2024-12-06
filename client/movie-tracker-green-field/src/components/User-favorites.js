import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function UserFavorites() {
  const [movies, setMovies] = useState([]); // State to hold favorite movies
  const [error, setError] = useState("");

  let userId;
  let token;

  // Decode the token to retrieve userId
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    userId = decoded.userId;
  }

  // Fetch favorite movies
  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch(`http://localhost:8080/movies`);
        // console.log(response);
        const result = await response.json();
        console.log(result);
        setMovies(result.data); // Set the movies state with the response
      } catch (err) {
        console.error("Error fetching favorite movies:", err);
        setError("Failed to fetch favorite movies. Try again later.");
      }
    }
    fetchMovies();
  }, [userId, token]); // Runs only when userId or token changes

  // Function to add a movie to favorites
  const handleAddToFavorites = async (movieId) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/movies/favorites`,
        {
          userId,
          movieId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update local state to reflect the new favorite
        const newFavoriteMovie = response.data.movie; // Assume backend returns the added movie
        setMovies((prevMovies) => [...prevMovies, newFavoriteMovie]);
        alert("Movie added to favorites!");
      }
    } catch (err) {
      console.error("Error adding movie to favorites:", err);
      alert("Failed to add movie to favorites.");
    }
  };

  // Function to delete a movie from favorites
  const handleDelete = async (movieId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/movies/favorites/${movieId}`, // Dynamic path with ID
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // Update local state
        setMovies((prevMovies) =>
          prevMovies.filter((movie) => movie._id !== movieId)
        );
        alert("Movie removed from favorites.");
      }
    } catch (err) {
      console.error("Error removing favorite movie:", err);
      alert("Failed to remove movie from favorites.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Your Favorite Movies</h2>
      {error && <p className="text-danger">{error}</p>}
      {movies.length === 0 ? (
        <p>No favorite movies found.</p>
      ) : (
        <div className="row">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="col-md-4 mb-4"
              style={{ width: "18rem" }}
            >
              <div className="card">
                <img
                  src={`https://image.tmdb.org/t/p/w400${movie.posterUrl}`}
                  className="card-img-top"
                  alt={movie.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text">{movie.overview}</p>
                  <p className="small text-muted">
                    Release Date:{" "}
                    {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <button
                    style={{ backgroundColor: "red" }}
                    className="btn btn-danger"
                    onClick={() => handleDelete(movie._id)}
                  >
                    Remove from Favorites
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserFavorites;
