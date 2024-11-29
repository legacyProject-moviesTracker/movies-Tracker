import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Navbar.css";

const Navbar = ({ isLoggedIn, username, onLogout }) => {
  const handleHomeClick = () => {
    // Use window.location to force a page reload
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* Trigger home navigation and refresh when clicking on the logo */}
        <span onClick={handleHomeClick} style={{ cursor: "pointer" }}>
          MovieTracker
        </span>
      </div>
      <ul className="navbar-links">
        <li>
          {/* Trigger home navigation and refresh when clicking on the Home link */}
          <span onClick={handleHomeClick} style={{ cursor: "pointer" }}>
            Home
          </span>
        </li>
        <li className="dropdown">
          <span>Movies</span>
          <ul className="dropdown-menu">
            <li>
              <Link to="/movies/now-playing">Playing Now</Link>
            </li>
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
        {isLoggedIn && (
          <li>
            <span>Welcome, {username}</span>
          </li>
        )}
        {isLoggedIn ? (
          <li>
            <button onClick={onLogout}>Log Out</button>
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
