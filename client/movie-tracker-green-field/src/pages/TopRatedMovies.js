import React, { useEffect, useState } from "react";
import MovieList from "../components/MovieList";
import { fetchMovies } from "../services/api";

const TopRatedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      const topRatedMovies = await fetchMovies("movie/top_rated");
      setMovies(topRatedMovies || []);
      setLoading(false);
    };

    loadMovies();
  }, []);

  if (loading) return <p>Loading movies...</p>;

  return (
    <div>
      <h1>Top Rated Movies</h1>
      <MovieList title="Top Rated Movies" movies={movies} />
    </div>
  );
};

export default TopRatedMovies;
