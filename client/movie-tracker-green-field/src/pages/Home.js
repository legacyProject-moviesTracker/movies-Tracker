import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";
import MovieCarousel from "../components/MovieCarousel";
import Footer from "../components/Footer";
import { fetchMovies } from "../services/api";

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [carouselMovies, setCarouselMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulated login
  const [username, setUsername] = useState("Niko Velakia"); // Simulated username
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const trending = await fetchMovies("trending/movie/day");
        const popular = await fetchMovies("movie/popular");
        const nowPlaying = await fetchMovies("movie/now_playing");

        setTrendingMovies(trending);
        setPopularMovies(popular);
        setCarouselMovies(nowPlaying);
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    };

    loadMovies();
  }, []);

  const handleSearch = (query) => {
    if (!query) {
      setSearchResults([]); // Clear search results
      return;
    }

    // Filter movies locally
    const allMovies = [...trendingMovies, ...popularMovies];
    const results = allMovies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Simulate logging out
    setUsername(""); // Clear username
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      <MovieCarousel movies={carouselMovies} />
      <SearchBar onSearch={handleSearch} />
      {searchResults.length > 0 ? (
        <MovieList
          title="Search Results"
          movies={searchResults}
          onMovieClick={(movieId) => navigate(`/movie/${movieId}`)}
        />
      ) : (
        <>
          <MovieList
            title="Trending Today"
            movies={trendingMovies}
            onMovieClick={(movieId) => navigate(`/movie/${movieId}`)}
          />
          <MovieList
            title="Popular Movies"
            movies={popularMovies}
            onMovieClick={(movieId) => navigate(`/movie/${movieId}`)}
          />
        </>
      )}
      <Footer />
    </>
  );
};

export default Home;
