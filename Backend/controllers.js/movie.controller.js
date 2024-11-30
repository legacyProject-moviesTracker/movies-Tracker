require('dotenv').config();
const axios = require('axios');
const Movie = require('../models/moviesModel');
const User = require('../models/userModel');

const apiURL = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=en-US&page=1`;

const getAllMovies = async (req, res) => {
    try {
        const response = await axios.get(apiURL);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching movies" });
    }
};

const addFavoriteMovie = async (req, res) => {
    try {
        const { apiId, userId } = req.body;

        // Check if the user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch the movie details from the external API using the apiId
        const movieDetails = await axios.get(`https://api.themoviedb.org/3/movie/${apiId}?api_key=${process.env.API_KEY}&language=en-US`);

        // Check if the movie already exists in the user's favorites
        const existingMovie = await Movie.findOne({ apiId, userId });
        if (existingMovie) {
            return res.status(400).json({ message: "Movie is already in your favorites." });
        }

        // Create a new favorite movie entry
        const newMovie = new Movie({
            title: movieDetails.data.title,         // Movie title from the API
            genre: movieDetails.data.genres[0]?.name || "Unknown", // Use first genre or "Unknown"
            releaseDate: movieDetails.data.release_date,
            posterUrl: `https://image.tmdb.org/t/p/w500${movieDetails.data.poster_path}`, // Movie poster URL
            apiId,  // API ID of the movie
            userId, // User ID to link the movie with the user
        });

        // Save the movie to the database
        await newMovie.save();

        // Add the movie to the user's favorites list
        userExists.favoriteMovies.push(newMovie._id);
        await userExists.save();

        res.status(201).json({ message: "Movie added to favorites successfully!", movie: newMovie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding movie to favorites" });
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
            return res.status(404).json({ message: "Movie not found in your favorites." });
        }

        // Fetch new movie details from the external API
        const movieDetails = await axios.get(`https://api.themoviedb.org/3/movie/${apiId}?api_key=${process.env.API_KEY}&language=en-US`);

        // Replace the movie details with the new data
        movie.title = movieDetails.data.title;
        movie.genre = movieDetails.data.genres[0]?.name || "Unknown";
        movie.releaseDate = movieDetails.data.release_date;
        movie.posterUrl = `https://image.tmdb.org/t/p/w500${movieDetails.data.poster_path}`;
        movie.apiId = apiId;  // Updating apiId, in case it's changed

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
            return res.status(404).json({ message: "Movie not found in your favorites." });
        }

        res.status(200).json({ message: "Movie removed from favorites successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting movie" });
    }
};


module.exports = { 
    getAllMovies,
    addFavoriteMovie,
    updateFavoriteMovie,
    deleteFavoriteMovie
 };
