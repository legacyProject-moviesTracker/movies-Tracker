import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/Navbar.css";

const Navbar = ({
  isLoggedIn,
  username,
  onLogout
}) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/", { replace: true });
    window.location.reload(); // Refresh the page
  };

  const handleProfileClick = () => {
    navigate("/user-page"); // Navigate to the user page
  };

  const handleLogout = () => {
    onLogout(); // Call the logout function
    localStorage.removeItem("token"); // Clear the token from storage
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span
          onClick={() => {
            handleHomeClick();
          }}
          style={{ cursor: "pointer" }}
        >
          MovieTracker
        </span>
      </div>
      <ul className="navbar-links">
        <li className="dropdown">
          <span>Movies</span>
          <ul className="dropdown-menu">
            <li>
              <Link to="/movies/top-rated">Top Rated</Link>
            </li>
            <li>
              <Link to="/movies/upcoming">Upcoming</Link>
            </li>
            <li>
              <Link to="/movies/popular">Popular</Link>
            </li>
          </ul>
        </li>

        <li>
          <span
            onClick={() => {
              handleProfileClick();
            }}
            style={{
              cursor: "pointer",
              color: "#01b4e4",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            {username || ""}
          </span>
        </li>

        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout} className="logout-btn">
              Log Out
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login">Log out</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
