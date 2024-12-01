import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchMovieDetails, fetchMovieCast } from "../services/api";

const MovieDetails = () => {
  const { movieId } = useParams(); // Get movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const loadMovieDetails = async () => {
      const movieData = await fetchMovieDetails(movieId); // Fetch details
      const movieCast = await fetchMovieCast(movieId); // Fetch cast
      setMovie(movieData);
      setCast(movieCast);
    };

    loadMovieDetails();
  }, [movieId]);

  if (!movie) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="movie-details">
        <div className="movie-header">
          <img src={movie.posterUrl} alt={movie.title} />
          <div>
            <h1>
              {movie.title} ({movie.releaseDate.split("-")[0]})
            </h1>
            <p>{movie.genre}</p>
            <p>Rating: {movie.rating}%</p>
          </div>
        </div>
        <div className="movie-overview">
          <h2>Overview</h2>
          <p>{movie.overview}</p>
        </div>
        <div className="movie-cast">
          <h2>Cast</h2>
          <div className="cast-list">
            {cast.map((actor) => (
              <div key={actor.id} className="cast-card">
                <img src={actor.profileUrl} alt={actor.name} />
                <p>{actor.name}</p>
                <p>as {actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MovieDetails;
