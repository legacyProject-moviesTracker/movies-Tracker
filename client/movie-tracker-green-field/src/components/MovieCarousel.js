import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "../assets/styles/MovieCarousel.css";

const MovieCarousel = ({ movies }) => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
  };

  const handleImageClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="carousel-item"
            onClick={() => handleImageClick(movie.id)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={movie.title}
              className="carousel-image"
            />
            <div className="carousel-caption">
              <h2>{movie.title}</h2>
              <p>{movie.overview.slice(0, 150)}...</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

const CustomArrow = ({ direction, onClick }) => {
  return (
    <div className={`carousel-arrow ${direction}`} onClick={onClick}>
      {direction === "left" ? "<" : ">"}
    </div>
  );
};

export default MovieCarousel;
