import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserMovies from "../components/UserMovies";
import Navbar from "../components/Navbar";
import Comments from "../components/Comments";
import { jwtDecode } from "jwt-decode"; // Fix incorrect import
import "../assets/styles/Profile.css"; // Ensure you have Profile.css

const UserPage = () => {
  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allMovies, setAllMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  // lists visibilities
  const [viewFavoriteList, setViewFavoriteList] = useState(false);
  const [viewWatchedList, setViewWatchedList] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "User");
        setIsAuthenticated(true);
        navigate("/user-page");
      } else {
        setIsAuthenticated(false);
        navigate("/login"); // Redirect to login if no token is found
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setIsAuthenticated(false);
      navigate("/login"); // Redirect if token decoding fails
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return <h1>Redirecting to Login...</h1>; // Show a placeholder while redirecting
  }

  return (
    <div className="profile-container">
      <Navbar
        allMovies={allMovies}
        favoriteMovies={favoriteMovies}
        watchedMovies={watchedMovies}
      />
      <h1 className="welcome-message">Welcome, {username}!</h1>
      <div className="profile-content">
        <div className="favorites-section">
          <UserMovies
            allMovies={allMovies}
            setAllMovies={setAllMovies}
            favoriteMovies={favoriteMovies}
            setFavoriteMovies={setFavoriteMovies}
            watchedMovies={watchedMovies}
            setWatchedMovies={setWatchedMovies}
          />
        </div>
        <div className="comments-section">
          <Comments />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
