import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/MovieCard.css";

const UserMovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleMovieClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleMovieClick}>
      <div className="movie-card-img-container">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="movie-card-img"
        />
        <span className="movie-card-rating">
          {Math.round(movie.vote_average * 10)}%
        </span>
      </div>
      <div className="movie-card-details">
        <h4 className="movie-card-title">{movie.title}</h4>
        <p className="movie-card-date">{new Date(movie.release_date).toDateString()}</p>
      </div>
    </div>
  );
};

export default UserMovieCard;