import React, { useEffect, useState } from "react";
import MovieList from "../components/MovieList";
import { fetchMovies } from "../services/api";

const NowPlayingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      const nowPlayingMovies = await fetchMovies("movie/now_playing");
      setMovies(nowPlayingMovies || []);
      setLoading(false);
    };

    loadMovies();
  }, []);

  if (loading) return <p>Loading movies...</p>;

  return (
    <div>
      <h1>Now Playing</h1>
      <MovieList title="Now Playing in Theaters" movies={movies} />
    </div>
  );
};

export default NowPlayingMovies;
