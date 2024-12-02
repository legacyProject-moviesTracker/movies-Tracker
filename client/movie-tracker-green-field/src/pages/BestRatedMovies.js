import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import { fetchMovies } from '../services/api';

const BestRatedMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      const bestRatedMovies = await fetchMovies('movie/top_rated');
      setMovies(bestRatedMovies);
    };

    loadMovies();
  }, []);

  return (
    <div>
      <h1>Best Rated Movies</h1>
      <MovieList title="Best Rated Movies" movies={movies} />
    </div>
  );
};

export default BestRatedMovies;
