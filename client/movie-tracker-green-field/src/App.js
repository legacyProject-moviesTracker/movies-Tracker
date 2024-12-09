import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./hook/ProtectedRoutes";
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
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movie/:movieId"
            element={
              <ProtectedRoute>
                <MovieDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies/top-rated"
            element={
              <ProtectedRoute>
                <TopRatedMovies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies/upcoming"
            element={
              <ProtectedRoute>
                <UpcomingMovies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies/popular"
            element={
              <ProtectedRoute>
                <PopularMovies />
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user-page"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:userId"
            element={
              <ProtectedRoute>
                <SearchedPeople />
              </ProtectedRoute>
            }
          />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
