require("dotenv").config();
const axios = require("axios");
const Movie = require("../models/moviesModel");
const User = require("../models/userModel");

const apiURL = `https://api.themoviedb.org/3/movie?api_key=${process.env.API_KEY}&language=en-US&page=1`;

// all favorite movies
const getAllMovies = async (req, res) => {
  try {
    const response = await Movie.find({});
    // console.log(response);
    // Send the response to the user
    res.status(200).json({
      message: "All movies fetched and stored successfully!",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching and storing all movies" });
  }
};

// Reusable Authorization token
const TMDB_AUTH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmNkYzk2ZWRiMDAxYzkzMzgzMWJhYTNkNDFlYmNkZCIsIm5iZiI6MTczMzUwNjEyNy45MSwic3ViIjoiNjc1MzM0NGY4NGNhOTI4ZDAwY2EwZjY3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.rRUc7oSgPwwoFi-xUFaCbMTfg5Y97PQpiRCzbrR0vck";

// Helper Function to fetch Movie Details
const fetchMovieDetails = async (apiId) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${apiId}?&language=en-US`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: TMDB_AUTH_TOKEN,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch movie details");
  return response.json();
};

// all favorite movies
const getFavoriteMovies = async (req, res) => {
  try {
    const response = await Movie.find({ favorite: true });
    // console.log(response);
    // Send the response to the user
    res.status(200).json({
      message: "Favorite movies fetched and stored successfully!",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching and storing favorite movies" });
  }
};
// all watched movies
const getWatchedMovies = async (req, res) => {
  try {
    const response = await Movie.find({ watched: true });
    // console.log(response);
    // Send the response to the user
    res.status(200).json({
      message: "Watched movies fetched and stored successfully!",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching and storing watched movies" });
  }
};

// Add Favorite Movie
const addFavoriteMovie = async (req, res) => {
  try {
    const { apiId, userId } = req.body;

    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    // Fetch Movie Details
    const movieDetails = await fetchMovieDetails(apiId);

    // Check for Existing Movie
    const existingMovie = await Movie.findOne({ apiId });
    if (existingMovie) {
      if (existingMovie.favorite)
        return res
          .status(400)
          .json({ message: "Movie is already in your favorite list." });

      // Update favorite flag
      existingMovie.favorite = true;
      await existingMovie.save();

      return res.status(200).json({
        message: "Movie added to favorites successfully!",
        movie: existingMovie,
      });
    }

    // Create New Movie
    const newMovie = new Movie({
      title: movieDetails.title,
      genre: movieDetails.genres[0]?.name || "Unknown",
      releaseDate: movieDetails.release_date,
      posterUrl: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
      favorite: true,
      watched: false,
      comment: "",
      apiId,
    });

    await newMovie.save();

    // Add to User's Favorites
    userExists.favoriteMovies.push(newMovie._id);
    await userExists.save();

    res.status(201).json({
      message: "Movie added to favorites successfully!",
      movie: newMovie,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error adding movie to favorites" });
  }
};

// Add Watched Movie
const addMovieToWatched = async (req, res) => {
  try {
    const { apiId, userId } = req.body;

    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    // Fetch Movie Details
    const movieDetails = await fetchMovieDetails(apiId);

    // Check for Existing Movie
    const existingMovie = await Movie.findOne({ apiId });
    if (existingMovie) {
      if (existingMovie.watched)
        return res
          .status(400)
          .json({ message: "Movie is already in your watched list." });

      // Update watched flag
      existingMovie.watched = true;
      await existingMovie.save();

      return res.status(200).json({
        message: "Movie added to watched successfully!",
        movie: existingMovie,
      });
    }

    // Create New Movie
    const newMovie = new Movie({
      title: movieDetails.title,
      genre: movieDetails.genres[0]?.name || "Unknown",
      releaseDate: movieDetails.release_date,
      posterUrl: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
      favorite: false,
      watched: true,
      comment: "",
      apiId,
    });

    await newMovie.save();

    // Add to User's Watched List
    userExists.watchedMovies.push(newMovie._id);
    await userExists.save();

    res.status(201).json({
      message: "Movie added to watched successfully!",
      movie: newMovie,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error adding movie to watched" });
  }
};

const deleteFavoriteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const newValue = req.body.favorite;

    // Find and delete the movie by ID
    const movie = await Movie.findByIdAndUpdate(
      id,
      { favorite: newValue },
      { new: true }
    );
    // console.log(movie);
    if (!movie) {
      return res
        .status(404)
        .json({ message: "Movie not found in your favorites." });
    }
    // movie.favorite = false;
    res.status(200).json({
      message: "Movie removed from favorites successfully!",
      data: movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting movie" });
  }
};
const deleteWatchedMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const newValue = req.body.watched;

    // Find and delete the movie by ID
    const movie = await Movie.findByIdAndUpdate(
      id,
      { watched: newValue },
      { new: true }
    );
    // console.log(movie);
    if (!movie) {
      return res
        .status(404)
        .json({ message: "Movie not found in your watched list." });
    }
    // movie.favorite = false;
    res.status(200).json({
      message: "Movie removed from watched list successfully!",
      data: movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting movie" });
  }
};

const deleteMovieFromList = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the movie by ID
    const movie = await Movie.findByIdAndDelete(id, { new: true });
    // console.log(movie);
    if (!movie) {
      return res
        .status(404)
        .json({ message: "Movie not found in your movie list." });
    }
    // movie.favorite = false;
    res.status(200).json({
      message: "Movie removed from movie list successfully!",
      data: movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting movie" });
  }
};

// delete all the list

const deleteAllList = async (req, res) => {
  try {
    const result = await Movie.deleteMany();
    // console.log(result);
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "there are no movies in your movies list." });
    }
    // movie.favorite = false;
    res.status(200).json({
      message: "all movies list removed successfully!",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting movie" });
  }
};

module.exports = {
  getAllMovies,
  getWatchedMovies,
  getFavoriteMovies,
  addFavoriteMovie,
  addMovieToWatched,
  deleteFavoriteMovie,
  deleteWatchedMovie,
  deleteMovieFromList,
  deleteAllList,
};
