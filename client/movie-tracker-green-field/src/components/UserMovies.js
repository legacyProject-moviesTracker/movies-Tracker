import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import Comments from "../components/Comments";

function UserMovies({
  decoded,
  allMovies,
  setAllMovies,
  favoriteMovies,
  setFavoriteMovies,
  watchedMovies,
  setWatchedMovies,
  viewFavoriteList,
  setViewFavoriteList,
  viewWatchedList,
  setViewWatchedList,
}) {
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [username, setUsername] = useState("My Profile");

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
        const response = await fetch(
          `http://localhost:8080/movies/${decoded.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response);
        const result = await response.json();
        // console.log(result);
        setAllMovies(result.data); // Set the movies state with the response
      } catch (err) {
        console.error("Error fetching all movies:", err);
        setError("Failed to fetch all movies. Try again later.");
      }
    }
    fetchMovies();
    async function fetchFavoriteMovies() {
      try {
        const response = await fetch(
          `http://localhost:8080/movies/allFavoriteMovies/${decoded.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response);
        const result = await response.json();
        // console.log(result);
        setFavoriteMovies(result.data); // Set the movies state with the response
      } catch (err) {
        console.error("Error fetching favorite movies:", err);
        setError("Failed to fetch favorite movies. Try again later.");
      }
    }
    fetchFavoriteMovies();
    async function fetchWatchedMovies() {
      try {
        const response = await fetch(
          `http://localhost:8080/movies/allWatchedMovies/${decoded.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response);
        const result = await response.json();
        // console.log(result);
        setWatchedMovies(result.data); // Set the movies state with the response
      } catch (err) {
        console.error("Error fetching watched movies:", err);
        setError("Failed to fetch movies. Try again later.");
      }
    }
    fetchWatchedMovies();

    const loadMovies = async () => {
      const popularMovies = await fetchMovies(`movie/:movieId`);
      setMovies(popularMovies || []);
      setLoading(false);
    };

    loadMovies();
  }, [userId, token]); // Runs only when userId or token changes

  // Function to delete a movie from favorites
  const handleDeleteFromFavorite = async (movieId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/movies/deleteFavorite/${movieId}`, // Dynamic path with ID
        {
          headers: { Authorization: `Bearer ${token}`, favorite: false },
        }
      );

      if (response.status === 200) {
        // Update local state
        setFavoriteMovies((prevMovies) =>
          prevMovies.filter((movie) => movie._id !== movieId)
        );
        setAllMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie._id === movieId ? { ...movie, favorite: false } : movie
          )
        );
        alert("Movie removed from your favorite.");
      }
    } catch (err) {
      console.error("Error removing movie from favorites:", err);
      alert("Failed to remove movie from favorites.");
    }
  };

  // Function to delete a movie from watched movies list
  const handleDeleteFromWatched = async (movieId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/movies/deleteWatchedMovie/${movieId}`, // Dynamic path with ID

        {
          headers: { Authorization: `Bearer ${token}`, watched: false },
        }
      );

      if (response.status === 200) {
        // Update local state
        setWatchedMovies((prevMovies) =>
          prevMovies.filter((movie) => movie._id !== movieId)
        );
        setAllMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie._id === movieId ? { ...movie, watched: false } : movie
          )
        );
        alert("Movie removed from watched.");
      }
    } catch (err) {
      console.error("Error removing movie from watched:", err);
      alert("Failed to remove movie from watched.");
    }
  };


  // delete all the list
  const handleDeleteAllMovies = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/movies/deleteAllList`, // Dynamic path with ID
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // Update local state
        setAllMovies([]);
        setWatchedMovies([]);
        setFavoriteMovies([]);
        alert("all movies removed.");
      }
    } catch (err) {
      console.error("Error removing all movie from list:", err);
      alert("Failed to remove movies list.");
    }
  };
  if (loading) return <p>Loading movies...</p>;

  return (
    <div className="movie-page-container">
      <ul>
        {!viewFavoriteList && (
          <ol>
            <a
              onClick={() => {
                setViewFavoriteList(true);
                setViewWatchedList(false);
              }}
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                color: "#333",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "20px",
              }}
            >
              Favorite Movies
            </a>
          </ol>
        )}{" "}
        {!viewWatchedList && (
          <ol>
            <a
              onClick={() => {
                setViewWatchedList(true);
                setViewFavoriteList(false);
              }}
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                color: "#333",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "20px",
              }}
            >
              Watched Movies
            </a>
          </ol>
        )}
      </ul>
      {viewFavoriteList === true ? (
        <div className="movie-pages-container">
          <h2 className="movie-page-header">Favorite Movies</h2>
          {error && <p className="text-danger">{error}</p>}
          {favoriteMovies.length === 0 ? (
            <p>No favorite movies found.</p>
          ) : (
            <div className="movie-grids">
              {favoriteMovies.map((movie) => (
                <div className="movie-links " key={movie.apiId}>
                  <div className="movie-cards">
                    <Link
                      className="movie-cards-img-container"
                      to={`/movie/${movie.apiId}`}
                    >
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="movie-card-img"
                      />
                    </Link>
                    <div className="movie-cards-details">
                      <h5
                        style={{
                          cursor: "pointer",
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "18px",
                          margin: "0",
                        }}
                      >
                        {movie.title}
                      </h5>
                      {movie.favorite && (
                        <button
                          style={{
                            backgroundColor: "red",
                            marginBottom: "5px",
                            marginRight: "5px",
                            borderRadius: "5px",
                          }}
                          className="btn btn-danger"
                          onClick={() => handleDeleteFromFavorite(movie._id)}
                        >
                          Remove from Favorites
                        </button>
                      )}
                      {/* <div className="comments-section"> */}
                      <Comments movieId={movie._id} />
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        ""
      )}{" "}
      {viewWatchedList === true ? (
        <div className="movie-pages-container">
          <h2 className="movie-page-header">Watched Movies</h2>
          {error && <p className="text-danger">{error}</p>}
          {watchedMovies.length === 0 ? (
            <p>No watched movies yet.</p>
          ) : (
            <div className="movie-grids">
              {watchedMovies.map((movie) => (
                <div className="movie-links " key={movie.apiId}>
                  <div className="movie-cards">
                    <Link
                      className="movie-cards-img-container"
                      to={`/movie/${movie.apiId}`}
                    >
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="movie-card-img"
                      />
                    </Link>
                    <div className="movie-cards-details">
                      <h5
                        style={{
                          cursor: "pointer",
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "18px",
                          margin: "0",
                        }}
                      >
                        {movie.title}
                      </h5>
                      {movie.watched && (
                        <button
                          style={{
                            backgroundColor: "red",
                            marginBottom: "5px",
                            marginRight: "5px",
                            borderRadius: "5px",
                          }}
                          className="btn btn-danger"
                          onClick={() => handleDeleteFromWatched(movie._id)}
                        >
                          Remove from Watched
                        </button>
                      )}
                      {/* <div className="comments-section"> */}
                      <Comments movieId={movie._id} />
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        ""
      )}
      {allMovies.length > 0 ? (
        <button
          style={{ backgroundColor: "red" }}
          onClick={handleDeleteAllMovies}
        >
          Delete all list
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default UserMovies;
