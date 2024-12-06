require("dotenv").config();
const axios = require("axios");
const Movie = require("../models/moviesModel");
const User = require("../models/userModel");

const apiURL = `https://api.themoviedb.org/3/movie?api_key=${process.env.API_KEY}&language=en-US&page=1`;

const getAllMovies = async (req, res) => {
  try {
    // Fetch the movies from the API
    // const response = await axios.get(apiURL);

    // Loop through the fetched movies and save each one to the database
    // for (const movieData of response.data.results) {
    //   const { title, genre, release_date, poster_path, id } = movieData;

    //   // Check if the movie already exists in the database (optional, to avoid duplicates)
    //   const existingMovie = await Movie.findOne({ apiId: id });
    //   if (!existingMovie) {
    //     // Create a new movie entry and save it to the database
    //     const newMovie = new Movie({
    //       title,
    //       genre: genre ? genre[0]?.name : "Unknown", // Example for handling multiple genres
    //       releaseDate: release_date,
    //       posterUrl: `https://image.tmdb.org/t/p/w500${poster_path}`,
    //       apiId: id,
    //     });

    //     await newMovie.save();
    //   }
    // }
    const response = await Movie.find({ favorite: true });
    console.log(response);
    // Send the response to the user (optional)
    res.status(200).json({
      message: "Movies fetched and stored successfully!",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching and storing movies" });
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

module.exports = { addFavoriteMovie };

const updateFavoriteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { apiId, userId } = req.body; // Expect new movie's apiId and userId

    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the existing movie by its ID (from the request params) and userId
    const movie = await Movie.findOne({ apiId, userId });

    if (!movie) {
      return res
        .status(404)
        .json({ message: "Movie not found in your favorites." });
    }

    // Fetch new movie details from the external API
    const movieDetails = await axios.get(
      `https://api.themoviedb.org/3/movie/${apiId}?api_key=${process.env.API_KEY}&language=en-US`
    );

    // Replace the movie details with the new data
    movie.title = movieDetails.data.title;
    movie.genre = movieDetails.data.genres[0]?.name || "Unknown";
    movie.releaseDate = movieDetails.data.release_date;
    movie.posterUrl = `https://image.tmdb.org/t/p/w500${movieDetails.data.poster_path}`;
    movie.apiId = apiId; // Updating apiId, in case it's changed

    // Save the updated movie
    await movie.save();

    res.status(200).json({ message: "Movie updated successfully!", movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating movie" });
  }
};

const deleteFavoriteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the movie by ID
    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return res
        .status(404)
        .json({ message: "Movie not found in your favorites." });
    }

    res
      .status(200)
      .json({ message: "Movie removed from favorites successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting movie" });
  }
};

module.exports = {
  getAllMovies,
  addFavoriteMovie,
  updateFavoriteMovie,
  deleteFavoriteMovie,
};
