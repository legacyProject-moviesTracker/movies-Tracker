import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchMovieDetails, fetchMovieCast } from "../services/api";
import "../assets/styles/MovieDetails.css"; 

const MovieDetails = () => {
  const { movieId } = useParams(); 
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState("");

  useEffect(() => {
    const loadMovieDetails = async () => {
      const movieData = await fetchMovieDetails(movieId); 
      const movieCast = await fetchMovieCast(movieId); 
      setMovie(movieData);
      setCast(movieCast);

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
    };

    loadMovieDetails();
  }, [movieId]);

  if (!movie) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
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
            <p className="movie-rating">
              <span className="rating-circle">{movie.rating}%</span> User Score
            </p>
            <p className="movie-overview">{movie.overview}</p>
          </div>
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
                src={`https://www.youtube.com/embed/${trailerKey}`}
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
