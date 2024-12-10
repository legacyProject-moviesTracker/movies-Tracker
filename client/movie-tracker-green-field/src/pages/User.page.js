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
    const [decoded, setDecoded] = useState(null); // Store decoded token here
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    // Fetch user data on component mount
    useEffect(() => {
        if (!token || typeof token !== "string") {
            console.error("Invalid token specified: Token is missing or not a string.");
            navigate("/login");
            return; // Exit early if no valid token
        }

        try {
            const decodedToken = jwtDecode(token);
            setDecoded(decodedToken); // Save decoded token in state
            setUsername(decodedToken.username || "User");
            setEmail(decodedToken.email || "");
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Failed to decode token:", error);
            navigate("/login");
        }
    }, [navigate, token]);

    // Function to handle updating user info
    const handleUpdateUserInfo = async (event) => {
        event.preventDefault(); // Prevent default form submission

        if (!decoded || !decoded.userId) {
            console.error("User ID is not available for update.");
            return; // Prevent further execution if userId is not available
        }

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

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                alert("Error updating user information: " + errorText);
                return;
            }

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
                    <p><strong>Username:</strong> {username}</p>
                    <p><strong>Email:</strong> {email}</p>
                </div>

                {/* Edit Section */}
                <form className="edit-section" onSubmit={handleUpdateUserInfo}>
                    <h2>Edit Your Information</h2>
                    <input 
                        type="text" 
                        placeholder="New Username"
                        defaultValue={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        type="email" 
                        placeholder="New Email"
                        defaultValue={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="New Password (leave blank to keep current)"
                        defaultValue={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="edit-btn" type="submit">Update Info</button>
                </form>

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