import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/", { replace: true });
    window.location.reload(); 
  };

  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-logo" onClick={handleLogoClick}>
          MovieTracker
        </span>
      </div>
      <div className="footer-center">
        <p>&copy; 2024 MovieTracker. All rights reserved.</p>
        <p>
          Your one-stop platform for discovering movies, exploring reviews, and
          keeping track of your favorites. Stay connected with the latest
          releases and trending films worldwide.
        </p>
        <p>
          <a href="/about-us" className="footer-link">
            About Us
          </a>{" "}
          |{" "}
          <a href="/terms" className="footer-link">
            Terms of Service
          </a>{" "}
          |{" "}
          <a href="/privacy" className="footer-link">
            Privacy Policy
          </a>
        </p>
      </div>
      <div className="footer-right">
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@movietracker.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <p>
            <span className="social-link">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png"
                alt="Facebook"
                className="social-icon"
              />
              Facebook
            </span>{" "}
            |
            <span className="social-link">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/2491px-Logo_of_Twitter.svg.png"
                alt="Twitter"
                className="social-icon"
              />
              Twitter
            </span>{" "}
            |
            <span className="social-link">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/2048px-Instagram_logo_2022.svg.png"
                alt="Instagram"
                className="social-icon"
              />
              Instagram
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
