import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Fix incorrect import
import { Link } from "react-router-dom";
import { fetchMovies } from "../services/api";
import Navbar from "../components/Navbar";
import "../assets/styles/MoviePage.css";

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("My Profile");

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log(token);
    if (token) {
      const decoded = jwtDecode(token);
      // console.log(decoded);
      setUsername(decoded.username || "User");
    }
    const loadMovies = async () => {
      const popularMovies = await fetchMovies("movie/popular");
      setMovies(popularMovies || []);
      setLoading(false);
    };

    loadMovies();
  }, []);

  if (loading) return <p>Loading movies...</p>;

  return (
    <>
      <Navbar username={username} /> {/* Add Navbar */}
      <div className="movie-page-container">
        <h1 className="movie-page-header">Popular Movies</h1>
        <div className="movie-grid">
          {movies.map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="movie-link"
            >
              <div className="movie-card">
                <div className="movie-card-img-container">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-card-img"
                  />
                </div>
                <div className="movie-card-details">
                  <h3 className="movie-card-title">{movie.title}</h3>
                  <p className="movie-card-date">
                    {new Date(movie.release_date).toDateString()}
                  </p>
                </div>
                <div className="movie-card-rating">
                  {movie.vote_average * 10}%
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default PopularMovies;
