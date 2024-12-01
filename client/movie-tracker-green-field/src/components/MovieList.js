import React from "react";
import MovieCard from "./MovieCard";
import "../assets/styles/MovieList.css";

const MovieList = ({ title, movies = [], onMovieClick }) => {
  return (
    <div className="movie-list">
      <h2 className="movie-list-title">{title}</h2>
      {movies.length > 0 ? (
        <div className="movie-list-container">
          {movies.map((movie) => (
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
