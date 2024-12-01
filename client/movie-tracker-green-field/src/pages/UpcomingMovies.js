import React, { useEffect, useState } from "react";
import MovieList from "../components/MovieList";
import { fetchMovies } from "../services/api";

const UpcomingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      const upcomingMovies = await fetchMovies("movie/upcoming");
      setMovies(upcomingMovies || []);
      setLoading(false);
    };

    loadMovies();
  }, []);

  if (loading) return <p>Loading movies...</p>;

  return (
    <div>
      <h1>Upcoming Movies</h1>
      <MovieList title="Upcoming Movies" movies={movies} />
    </div>
  );
};

export default UpcomingMovies;
