import React from "react";
import MovieCard from "./MovieCard";
import "../assets/styles/MovieList.css";

const MovieList = ({ title, movies = [], onMovieClick }) => {
  const validMovies = Array.isArray(movies) ? movies : [];

  return (
    <div className="movie-list">
      <h2 className="movie-list-title">{title}</h2>
      {validMovies.length > 0 ? (
        <div className="movie-list-container">
          {validMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onMovieClick={onMovieClick}
            />
          ))}
        </div>
      ) : (
        <p className="movie-list-empty">No movies available to display.</p>
      )}
    </div>
  );
};

export default MovieList;
