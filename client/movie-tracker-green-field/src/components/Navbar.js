import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import { jwtDecode } from "jwt-decode"; // Fix incorrect import
import "../assets/styles/Navbar.css";

const Navbar = ({ isLoggedIn, username, onLogout }) => {
  const [viewSearchPeople, setViewSearchPeople] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [searchedUser, setSearchedUser] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedUser, setSelectedUser] = useState({});

  const searchRef = useRef(null);
  const dropdownRef = useRef(null); // Ref for the dropdown

  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers();
    // console.log("Updated searchedUser:", searchedUser);
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchedUser([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchedUser]);

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
  const getAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
      }
      const allRetrievedUsers = await axios.get(
        "http://localhost:8080/user/allUsers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(allRetrievedUsers);
      setAllUsers(allRetrievedUsers.data.allUsers);
      // console.log(allUsers);
    } catch (error) {
      console.error("Error retrieve users:", error);
      alert(error.response.data.message);
    }
  };
  const handleInputChange = (e) => {
    e.preventDefault();
    const user = e.target.value.toLowerCase();
    setSearchInput(user); // Update input value

    const filteredUsers = allUsers.filter((u) =>
      u.username.toLowerCase().includes(user)
    );
    setSearchedUser(filteredUsers); // Set filtered results
  };

  // const finPeople = () => {};

  return (
    <nav className="navbar container-fluid px-5 shadow">
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
        <li id="searchPeopleContainer">
          <button
            id="getAllUsersBtn"
            style={{ display: viewSearchPeople ? "none" : "inline" }}
            onClick={() => setViewSearchPeople(!viewSearchPeople)}
          >
            Find people
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setViewSearchPeople(!viewSearchPeople);
              getAllUsers();
              // console.log(selectedUser);
              alert(`You selected ${selectedUser.username}`);
            }}
            style={{ display: viewSearchPeople ? "inline" : "none" }}
          >
            <input
              type="text"
              name="user"
              ref={searchRef}
              value={searchInput}
              placeholder="Find Other People"
              onChange={handleInputChange}
            />
            {searchedUser.length > 0 && searchInput && (
              <div
                id="searchResultsContainer"
                ref={dropdownRef} // Attach the ref to the dropdown
              >
                {searchedUser.map((user) => (
                  // console.log(user);
                  <ul
                    key={user._id}
                    style={{
                      padding: "5px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      backgroundColor: "grey",
                    }}
                    onClick={() => {
                      setSelectedUser(user);
                      setViewSearchPeople(false);
                      alert(`You selected ${user.username}`);
                      navigate(`/${user._id}`);
                      window.location.reload();
                      setSearchedUser([]); // Hide the results
                    }}
                  >
                    {user.username}
                  </ul>
                ))}
              </div>
            )}
          </form>
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
