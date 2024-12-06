require("dotenv").config();
const axios = require("axios");
const Movie = require("../models/moviesModel");
const User = require("../models/userModel");

const apiURL = `https://api.themoviedb.org/3/movie?api_key=${process.env.API_KEY}&language=en-US&page=1`;

// all favorite movies
const getAllMovies = async (req, res) => {
  try {
    const response = await Movie.find({});
    console.log(response);
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

// all favorite movies
const getFavoriteMovies = async (req, res) => {
  try {
    const response = await Movie.find({ favorite: true });
    console.log(response);
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
    console.log(response);
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

const addFavoriteMovie = async (req, res) => {
  try {
    const { apiId, userId } = req.body; // Extract `userId` from the request body

    // Check if the user exists
    const userExists = await User.findById(userId); // Fetch the user by ID
    if (!userExists) {
      return res.status(404).json({ message: "User not found" }); // Handle user not found case
    }

    // Fetch the movie details from the external API using the `apiId`
    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${apiId}?&language=en-US`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmNkYzk2ZWRiMDAxYzkzMzgzMWJhYTNkNDFlYmNkZCIsIm5iZiI6MTczMzUwNjEyNy45MSwic3ViIjoiNjc1MzM0NGY4NGNhOTI4ZDAwY2EwZjY3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.rRUc7oSgPwwoFi-xUFaCbMTfg5Y97PQpiRCzbrR0vck",
        },
      }
    );

    if (!movieResponse.ok) {
      return res
        .status(movieResponse.status)
        .json({ message: "Failed to fetch movie details from TMDB" });
    }

    const movieDetails = await movieResponse.json(); // Parse the movie details

    // Check if the movie already exists in the database
    const existingMovie = await Movie.findOne({ apiId });
    if (existingMovie) {
      return res
        .status(400)
        .json({ message: "Movie is already in your favorites." }); // Prevent duplicates
    }

    // Create a new movie entry in the database
    const newMovie = new Movie({
      title: movieDetails.title, // Movie title from TMDB
      genre: movieDetails.genres[0]?.name || "Unknown", // First genre or fallback
      releaseDate: movieDetails.release_date, // Release date from TMDB
      posterUrl: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`, // TMDB poster URL
      favorite: true, // Mark as favorite
      watched: false, // Default value
      comment: "", // Default empty comment
      apiId, // TMDB API movie ID
    });

    await newMovie.save(); // Save the new movie to the database

    // Add the movie to the user's favorites list
    userExists.favoriteMovies.push(newMovie._id); // Push the movie's ObjectId to the user's favorites
    await userExists.save(); // Save the updated user document

    // Respond with success
    res.status(201).json({
      message: "Movie added to favorites successfully!",
      movie: newMovie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding movie to favorites" }); // Handle any errors
  }
};

const addMovieToWatched = async (req, res) => {
  try {
    const { apiId, userId } = req.body; // Extract `userId` from the request body

    // Check if the user exists
    const userExists = await User.findById(userId); // Fetch the user by ID
    if (!userExists) {
      return res.status(404).json({ message: "User not found" }); // Handle user not found case
    }

    // Fetch the movie details from the external API using the `apiId`
    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${apiId}?&language=en-US`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmNkYzk2ZWRiMDAxYzkzMzgzMWJhYTNkNDFlYmNkZCIsIm5iZiI6MTczMzUwNjEyNy45MSwic3ViIjoiNjc1MzM0NGY4NGNhOTI4ZDAwY2EwZjY3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.rRUc7oSgPwwoFi-xUFaCbMTfg5Y97PQpiRCzbrR0vck",
        },
      }
    );

    if (!movieResponse.ok) {
      return res
        .status(movieResponse.status)
        .json({ message: "Failed to fetch movie details from TMDB" });
    }

    const movieDetails = await movieResponse.json(); // Parse the movie details

    // Check if the movie already exists in the database
    const existingMovie = await Movie.findOne({ apiId });
    if (existingMovie) {
      return res
        .status(400)
        .json({ message: "Movie is already in your watched list." }); // Prevent duplicates
    }

    // Create a new movie entry in the database
    const newMovie = new Movie({
      title: movieDetails.title, // Movie title from TMDB
      genre: movieDetails.genres[0]?.name || "Unknown", // First genre or fallback
      releaseDate: movieDetails.release_date, // Release date from TMDB
      posterUrl: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`, // TMDB poster URL
      watched: true, // Default value
      apiId, // TMDB API movie ID
    });

    await newMovie.save(); // Save the new movie to the database

    // Add the movie to the user's watched list
    userExists.watchedMovies.push(newMovie._id); // Push the movie's ObjectId to the user's watched
    await userExists.save(); // Save the updated user document

    // Respond with success
    res.status(201).json({
      message: "Movie added to watched successfully!",
      movie: newMovie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding movie to watched" }); // Handle any errors
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
    console.log(movie);
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
    console.log(movie);
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
    console.log(movie);
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
    console.log(result);
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
