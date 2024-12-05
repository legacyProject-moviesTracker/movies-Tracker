import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Fix incorrect import
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  fetchMovieDetails,
  fetchMovieCast,
  fetchRelatedMovies,
} from "../services/api";
import "../assets/styles/MovieDetails.css";

const MovieDetails = ({ user }) => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState("");
  const [message, setMessage] = useState(""); // For displaying success/error messages
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setUsername(decoded.username || "User");
        }
        const movieData = await fetchMovieDetails(movieId);
        const movieCast = await fetchMovieCast(movieId);
        const related = await fetchRelatedMovies(movieId);

        setMovie(movieData);
        setCast(movieCast);
        setRelatedMovies(related);

        // Fetch YouTube trailer
        const trailerResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=1d96b86ca67b80b6ffe19947686664ef`
        );
        const trailerData = await trailerResponse.json();
        const trailer = trailerData.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error("Error loading movie details:", error);
      }
    };

    loadMovieDetails();
  }, [movieId]);

  const handleAddToFavorites = async () => {
    try {
      const response = await fetch(`/user/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          userId: user.userId,
          movieId: movieId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding to favorites:", errorData.message);
        setMessage(errorData.message || "Failed to add movie to favorites.");
        return;
      }

      setMessage("Movie added to favorites!");
    } catch (error) {
      console.error("Error adding movie to favorites:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleRelatedMovieClick = (relatedMovieId) => {
    navigate(`/movie/${relatedMovieId}`);
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <>
      <Navbar username={username} />
      <div
        className="movie-details-container"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.posterUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        <div className="movie-header">
          <div className="movie-poster">
            <img src={movie.posterUrl} alt={movie.title} />
          </div>
          <div className="movie-info">
            <h1 className="movie-title">
              {movie.title} ({movie.releaseDate.split("-")[0]})
            </h1>
            <p className="movie-genres">{movie.genre}</p>
            <div className="movie-action-bar">
              <p className="movie-rating">
                <span className="rating-circle">{movie.rating}%</span> User
                Score
              </p>
              <button
                className="add-to-favorites-btn"
                onClick={handleAddToFavorites}
              >
                Add to Favorites
              </button>
            </div>
            <p className="movie-overview">{movie.overview}</p>
            {message && <p className="favorite-message">{message}</p>}
          </div>
        </div>

        {/* Related Movies Section */}
        <div className="related-movies-container">
          <h3 className="related-movies-title">Related Movies</h3>
          <ul className="related-movies-list">
            {relatedMovies.map((related) => (
              <li
                key={related.id}
                className="related-movies-item"
                onClick={() => handleRelatedMovieClick(related.id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${related.posterUrl}`}
                  alt={related.title}
                  className="related-movies-thumbnail"
                />
                <span className="related-movies-title-text">
                  {related.title}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cast Section */}
        <div className="movie-cast-section">
          <h2 className="movie-cast-title">Top Billed Cast</h2>
          <div className="cast-list-container">
            {cast.map((actor) => (
              <div key={actor.id} className="cast-card">
                <div className="cast-card-img-container">
                  <img
                    src={actor.profileUrl}
                    alt={actor.name}
                    className="cast-card-img"
                  />
                </div>
                <div className="cast-card-details">
                  <h3 className="cast-card-name">{actor.name}</h3>
                  <p className="cast-card-character">as {actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* YouTube Trailer Section */}
        {trailerKey && (
          <div className="movie-trailer-section">
            <h2 className="trailer-title">Watch the Trailer</h2>
            <div className="trailer-video">
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${trailerKey}?enablejsapi=1`}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MovieDetails;
