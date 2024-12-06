import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function UserMovies({
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
  viewAllMoviesList,
  setViewAllMoviesList,
}) {
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
          `http://localhost:8080/movies/allFavoriteMovies`
        );
        // console.log(response);
        const result = await response.json();
        console.log(result);
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
          `http://localhost:8080/movies/allWatchedMovies`
        );
        // console.log(response);
        const result = await response.json();
        console.log(result);
        setWatchedMovies(result.data); // Set the movies state with the response
      } catch (err) {
        console.error("Error fetching watched movies:", err);
        setError("Failed to fetch watched movies. Try again later.");
      }
    }
    fetchWatchedMovies();
  }, [userId, token]); // Runs only when userId or token changes

  // Function to add a movie to favorites
  // const handleAddToFavorites = async (movieId) => {
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:8080/movies/favorites`,
  //       {
  //         userId,
  //         movieId,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       // Update local state to reflect the new favorite
  //       const newFavoriteMovie = response.data.movie; // Assume backend returns the added movie
  //       setFavoriteMovies((prevMovies) => [...prevMovies, newFavoriteMovie]);
  //       alert("Movie added to favorites!");
  //     }
  //   } catch (err) {
  //     console.error("Error adding movie to favorites:", err);
  //     alert("Failed to add movie to favorites.");
  //   }
  // };

  // Function to delete a movie from favorites
  const handleDeleteFromFavorite = async (movieId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/movies/deleteFavorite/${movieId}`, // Dynamic path with ID
        { favorite: false },
        {
          headers: { Authorization: `Bearer ${token}` },
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
        { watched: false },
        {
          headers: { Authorization: `Bearer ${token}` },
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

  // Function to delete a movie from all the list
  const handleDeleteFromList = async (movieId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/movies/deleteMovieFromList/${movieId}`, // Dynamic path with ID
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // Update local state
        setAllMovies((prevMovies) =>
          prevMovies.filter((movie) => movie._id !== movieId)
        );
        //
        alert("Movie removed from your list.");
      }
    } catch (err) {
      console.error("Error removing movie from list:", err);
      alert("Failed to remove movie from list.");
    }
  };

  return (
    <div className="container mt-4">
      <ul>
        {!viewFavoriteList && (
          <ol>
            <a
              onClick={() => {
                setViewFavoriteList(true);
                setViewWatchedList(false);
                setViewAllMoviesList(false);
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
                setViewAllMoviesList(false);
              }}
            >
              Watched Movies
            </a>
          </ol>
        )}
        {!viewAllMoviesList && (
          <ol>
            <a
              onClick={() => {
                setViewAllMoviesList(true);
                setViewWatchedList(false);
                setViewFavoriteList(false);
              }}
            >
              All My Movies
            </a>
          </ol>
        )}
      </ul>
      {viewAllMoviesList === true ? (
        <div id="allMoviesList">
          <h2>All Your Movies</h2>
          {error && <p className="text-danger">{error}</p>}
          {allMovies.length === 0 ? (
            <p>No movies found.</p>
          ) : (
            <div className="row">
              {allMovies.map((movie) => (
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
                      <h5 className="card-title">
                        {movie.title} {movie.favorite && <p>Favorite</p>}{" "}
                        {movie.watched && <p>Watched</p>}
                      </h5>

                      <p className="card-text">{movie.overview}</p>
                      <p className="small text-muted">
                        Release Date:{" "}
                        {new Date(movie.releaseDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      {movie.favorite && (
                        <button
                          style={{ backgroundColor: "red" }}
                          className="btn btn-danger"
                          onClick={() => handleDeleteFromFavorite(movie._id)}
                        >
                          Remove from Favorites
                        </button>
                      )}
                      {movie.watched && (
                        <button
                          style={{ backgroundColor: "red" }}
                          className="btn btn-danger"
                          onClick={() => handleDeleteFromWatched(movie._id)}
                        >
                          Remove from Watched
                        </button>
                      )}
                      <button
                        style={{ backgroundColor: "red" }}
                        className="btn btn-danger"
                        onClick={() => handleDeleteFromList(movie._id)}
                      >
                        Delete From my List
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}{" "}
        </div>
      ) : (
        ""
      )}
      {viewFavoriteList === true ? (
        <div id="favoriteMovies">
          <h2>Favorite Movies</h2>
          {error && <p className="text-danger">{error}</p>}
          {favoriteMovies.length === 0 ? (
            <p>No favorite movies found.</p>
          ) : (
            <div className="row">
              {favoriteMovies.map((movie) => (
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
                      <h5 className="card-title">
                        {movie.title} {movie.favorite && <p>Favorite</p>}{" "}
                        {movie.watched && <p>Watched</p>}
                      </h5>

                      <p className="card-text">{movie.overview}</p>
                      <p className="small text-muted">
                        Release Date:{" "}
                        {new Date(movie.releaseDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      {movie.favorite && (
                        <button
                          style={{ backgroundColor: "red" }}
                          className="btn btn-danger"
                          onClick={() => handleDeleteFromFavorite(movie._id)}
                        >
                          Remove from Favorites
                        </button>
                      )}
                      {movie.watched && (
                        <button
                          style={{ backgroundColor: "red" }}
                          className="btn btn-danger"
                          onClick={() => handleDeleteFromWatched(movie._id)}
                        >
                          Remove from Watched
                        </button>
                      )}
                      <button
                        style={{ backgroundColor: "red" }}
                        className="btn btn-danger"
                        onClick={() => handleDeleteFromList(movie._id)}
                      >
                        Delete From my List
                      </button>
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
        <div id="favoriteMovies">
          <h2>Watched Movies</h2>
          {error && <p className="text-danger">{error}</p>}
          {watchedMovies.length === 0 ? (
            <p>No watched movies yet.</p>
          ) : (
            <div className="row">
              {watchedMovies.map((movie) => (
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
                      <h5 className="card-title">
                        {movie.title} {movie.favorite && <p>Favorite</p>}{" "}
                        {movie.watched && <p>Watched</p>}
                      </h5>

                      <p className="card-text">{movie.overview}</p>
                      <p className="small text-muted">
                        Release Date:{" "}
                        {new Date(movie.releaseDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      {movie.favorite && (
                        <button
                          style={{ backgroundColor: "red" }}
                          className="btn btn-danger"
                          onClick={() => handleDeleteFromFavorite(movie._id)}
                        >
                          Remove from Favorites
                        </button>
                      )}
                      {movie.watched && (
                        <button
                          style={{ backgroundColor: "red" }}
                          className="btn btn-danger"
                          onClick={() => handleDeleteFromWatched(movie._id)}
                        >
                          Remove from Watched
                        </button>
                      )}
                      <button
                        style={{ backgroundColor: "red" }}
                        className="btn btn-danger"
                        onClick={() => handleDeleteFromList(movie._id)}
                      >
                        Delete From my List
                      </button>
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
    </div>
  );
}

export default UserMovies;
