import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieList from '../components/MovieList';
import { fetchMovies } from '../services/api';

const GenreMovies = () => {
  const { genreId } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        console.log(`Fetching movies for genre ID: ${genreId}`); 
        const moviesData = await fetchMovies(`discover/movie?with_genres=${genreId}`);
        console.log('Movies fetched:', moviesData); 
        setMovies(moviesData || []);
      } catch (err) {
        console.error('Error fetching genre movies:', err);
        setError('Failed to fetch movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [genreId]);

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Movies by Genre</h1>
      {movies.length > 0 ? (
        <MovieList title="Genre Movies" movies={movies} />
      ) : (
        <p>No movies available to display.</p>
      )}
    </div>
  );
};

export default GenreMovies;
