import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../assets/styles/Login.css";

const initialValue = {
  email: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(initialValue);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/user/login",
        userData
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        alert("Logged in successfully!");
        navigate("/"); // Redirect to home page after login
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Log In</button>
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="link">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
