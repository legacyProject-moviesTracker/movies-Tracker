import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import TopRatedMovies from "./pages/TopRatedMovies";
import UpcomingMovies from "./pages/UpcomingMovies";
import PopularMovies from "./pages/PopularMovies";

const Profile = () => <h1>Your Profile Page</h1>; 

const App = () => {
  return (
<<<<<<< HEAD
    <div className="App">
      <p>Hello World test</p>
    </div>
=======

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:movieId" element={<MovieDetails />} />
        <Route path="/movies/top-rated" element={<TopRatedMovies />} />
        <Route path="/movies/upcoming" element={<UpcomingMovies />} />
        <Route path="/movies/popular" element={<PopularMovies />} />
        <Route path="/profile" element={<Profile />} /> {/* Profile page */}
      </Routes>
    </Router>

>>>>>>> f19478f85b6eb56e269ccb59893252122e216871
  );
};

export default App;