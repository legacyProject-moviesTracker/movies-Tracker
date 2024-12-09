import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserMovies from "../components/UserMovies";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import "../assets/styles/Profile.css";

const UserPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allMovies, setAllMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  // lists visibilities
  const [viewFavoriteList, setViewFavoriteList] = useState(true);
  const [viewWatchedList, setViewWatchedList] = useState(false);
  // const [viewAllMoviesList, setViewAllMoviesList] = useState(true);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let decoded = jwtDecode(token);

  useEffect(() => {
    if (token) {
      setUsername(decoded.username || "User");
      setEmail(decoded.email || "");
      setIsAuthenticated(true);
      navigate("/user-page");
    } else {
      setIsAuthenticated(false);
      navigate("/login");
    }
  }, [navigate, decoded.username, token]);

  const handleUpdateUserInfo = async () => {
    try {
        console.log("Updating user info for User ID:", decoded.userId);
        const response = await fetch(`http://localhost:8080/user/${decoded.userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ username, email, password }),
        });

        console.log('Response Status:', response.status);

        // Check if OK
        if (response.ok) {
            alert("User information updated successfully!");

            // Fetch updated user data from server
            const updatedResponse = await fetch(`http://localhost:8080/user/${decoded.userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (updatedResponse.ok) {
                const updatedUser = await updatedResponse.json();
                setUsername(updatedUser.user.username); // Update local state with new username
                setEmail(updatedUser.user.email); // Update local state with new email
            } else {
                console.error("Failed to fetch updated user data");
            }

            setPassword(""); // Optionally reset password field
        } else {
            const errorText = await response.text(); 
            console.error('Error response:', errorText); 
            try {
                const errorData = JSON.parse(errorText); 
                alert(errorData.msg || "Error updating user information");
            } catch (jsonError) {
                alert("Error updating user information: " + errorText); 
            }
        }
    } catch (error) {
        console.error("Error updating user info:", error);
    }
};


  if (!isAuthenticated) {
    return <h1>Redirecting to Login...</h1>;
  }

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        <h1>Welcome, {username}!</h1>
        
        {/* User Info */}
        <div>
          <h2>Your Information</h2>
          <p>Username: {username}</p>
          <p>Email: {email}</p>
        </div>

        {/* Edit Section */}
        <div className="edit-section">
          <h2>Edit Your Information</h2>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username"
          />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email"
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="New Password (leave blank to keep same)"
          />
          <button className="edit-btn" onClick={handleUpdateUserInfo}>Update Info</button>
        </div>

        {/* User Movies */}
        <UserMovies
          decoded={decoded}
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
          // viewAllMoviesList={viewAllMoviesList}
          // setViewAllMoviesList={setViewAllMoviesList}
        />
      </div>
    </div>
  );
};

export default UserPage; 