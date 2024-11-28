require('dotenv').config();
const axios = require('axios');
const Movie = require('../models/moviesModel');

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
        const { movieId, userId } = req.body;

        const existingMovie = await Movie.findOne({ movieId, userId });
        if (existingMovie) {
            return res.status(400).json({ message: "Movie is already in your favorites." });
        }

        // Create a new favorite movie entry
        const newMovie = new Movie({
            movieId,
            userId,
            isFavorite: true,
        });

        await newMovie.save();

        res.status(201).json({ message: "Movie added to favorites successfully!", movie: newMovie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding movie to favorites" });
    }
};

const updateFavoriteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { isWatched, priority } = req.body;

        // Find the movie by ID
        const movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).json({ message: "Movie not found in your favorites." });
        }

        // Update the movie properties
        if (isWatched !== undefined) movie.isWatched = isWatched;
        if (priority !== undefined) movie.priority = priority;

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
