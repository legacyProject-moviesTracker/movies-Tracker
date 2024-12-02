import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/Navbar.css";

const Navbar = ({ isLoggedIn, username, onLogout }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/", { replace: true });
    window.location.reload(); // Refresh the page
  };

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the profile page
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
            {/* Link to profile page */}
            <span
              onClick={handleProfileClick}
              style={{
                cursor: "pointer",
                color: "#01b4e4",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              Your Profile
            </span>
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
