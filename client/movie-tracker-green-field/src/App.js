import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import TopRatedMovies from "./pages/TopRatedMovies";
import UpcomingMovies from "./pages/UpcomingMovies";
import PopularMovies from "./pages/PopularMovies";
import Login from "./pages/Login";
import UserPage from "./pages/User.page";
import Register from "./pages/Register";
import SearchedPeople from "./pages/SearchedPeople";

// const Profile = () => <h1>Your Profile Page</h1>;

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/movie/:movieId" element={<MovieDetails />} />
          <Route path="/movies/top-rated" element={<TopRatedMovies />} />
          <Route path="/movies/upcoming" element={<UpcomingMovies />} />
          <Route path="/movies/popular" element={<PopularMovies />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes */}
          <Route path="/user-page" element={<UserPage />} />
          <Route path="/:userId" element={<SearchedPeople />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
