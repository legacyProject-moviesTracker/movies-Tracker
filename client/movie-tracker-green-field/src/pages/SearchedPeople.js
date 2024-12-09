import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UserMovies from "../components/UserMovies";
import Navbar from "../components/Navbar";
// import { jwtDecode } from "jwt-decode"; // Fix incorrect import
import "../assets/styles/Profile.css"; // Ensure you have Profile.css

const SearchedPeople = () => {
  const { userId } = useParams();
  //   const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  //
  const [allMovies, setAllMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  // lists visibilities
  const [viewFavoriteList, setViewFavoriteList] = useState(true);
  const [viewWatchedList, setViewWatchedList] = useState(false);

  //
  //   const [selectedUser, setSelectedUser] = useState({});

  const navigate = useNavigate();

  // console.log(decoded);
  useEffect(() => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        setIsAuthenticated(true);
        // Fetch details of the user based on userId (if needed)
        fetchUserDetails(userId);

        navigate(`/${userId}`);
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

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await axios.get(`http://localhost:8080/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //   console.log(response);
      setSelectedUser(response.data.user); // Update the state with fetched user
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  if (!isAuthenticated) {
    return <h1>Redirecting to Login...</h1>; // Show a placeholder while redirecting
  }
  let newSearchedUser = {
    email: selectedUser.email,
    userId,
    username: selectedUser.username,
  };
  return (
    <div className="profile-container">
      <Navbar />
      <h1
        className="welcome-message movie-page-header"
        style={{
          backgroundColor: "#947a4a",
          padding: "0",
          margin: "0",
          paddingTop: "15px",
        }}
      >
        Welcome to {selectedUser.username}!
      </h1>
      <div className="profile-content">
        <div className="favorites-section">
          <UserMovies
            decoded={newSearchedUser}
            allMovies={allMovies}
            setAllMovies={setAllMovies}
            favoriteMovies={favoriteMovies}
            setFavoriteMovies={setFavoriteMovies}
            watchedMovies={watchedMovies}
            setWatchedMovies={setWatchedMovies}
            viewFavoriteList={viewFavoriteList}
            setViewFavoriteList={setViewFavoriteList}
            viewWatchedList={viewWatchedList}
            setViewWatchedList={setViewWatchedList}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchedPeople;
