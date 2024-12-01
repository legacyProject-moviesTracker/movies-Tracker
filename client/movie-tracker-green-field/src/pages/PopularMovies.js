import React, { useEffect, useState } from "react";
import MovieList from "../components/MovieList";
import { fetchMovies } from "../services/api";

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      const popularMovies = await fetchMovies("movie/popular");
      setMovies(popularMovies || []);
      setLoading(false);
    };

    loadMovies();
  }, []);

  if (loading) return <p>Loading movies...</p>;

  return (
    <div>
      <h1>Popular Movies</h1>
      <MovieList title="Popular Movies" movies={movies} />
    </div>
  );
};

export default PopularMovies;
