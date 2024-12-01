import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";
import MovieCarousel from "../components/MovieCarousel";
import Footer from "../components/Footer";
import { fetchMovies, searchMovies, fetchFreeToWatchMovies } from "../services/api";

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [carouselMovies, setCarouselMovies] = useState([]); 
  const [freeToWatchMovies, setFreeToWatchMovies] = useState([]); 
  const [searchResults, setSearchResults] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [username, setUsername] = useState("Niko Velakia");
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = async () => {
      const trending = await fetchMovies("trending/movie/day");
      const popular = await fetchMovies("movie/popular");
      const freeToWatch = await fetchFreeToWatchMovies();

      setTrendingMovies(trending || []);
      setPopularMovies(popular || []);
      setCarouselMovies(trending || []); 
      setFreeToWatchMovies(freeToWatch || []);
    };

    loadMovies();
  }, []);

  const handleSearch = async (query) => {
    if (query.trim()) {
      const results = await searchMovies(query);
      setSearchResults(results || []);
    } else {
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
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
          <MovieList
            title="Free to Watch"
            movies={freeToWatchMovies}
            onMovieClick={(movieId) => navigate(`/movie/${movieId}`)}
          />
        </>
      )}
      <Footer />
    </>
  );
};

export default Home;
