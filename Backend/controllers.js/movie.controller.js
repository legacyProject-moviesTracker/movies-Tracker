require('dotenv').config();
const axios = require('axios');
const Movie = require('../models/moviesModel');
const User = require('../models/userModel');

const apiURL = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=en-US&page=1`;

const getAllMovies = async (req, res) => {
    try {
        // Fetch the movies from the API
        const response = await axios.get(apiURL);
        
        // Loop through the fetched movies and save each one to the database
        for (const movieData of response.data.results) {
            const { title, genre, release_date, poster_path, id } = movieData;

            // Check if the movie already exists in the database (optional, to avoid duplicates)
            const existingMovie = await Movie.findOne({ apiId: id });
            if (!existingMovie) {
                // Create a new movie entry and save it to the database
                const newMovie = new Movie({
                    title,
                    genre: genre ? genre[0]?.name : 'Unknown', // Example for handling multiple genres
                    releaseDate: release_date,
                    posterUrl: `https://image.tmdb.org/t/p/w500${poster_path}`,
                    apiId: id
                });

                await newMovie.save();
            }
        }

        // Send the response to the user (optional)
        res.status(200).json({ message: "Movies fetched and stored successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching and storing movies" });
    }
};


const addToFavorites = async () => {
    const { userId, movieId } = req.body;

    try {
        // Find the movie by ID
        const movie = await Movie.findOne({ apiId: movieId, userId });

        if (!movie) {
            // If the movie does not exist, create a new entry
            const newMovie = new Movie({
                apiId: movieId,
                userId,
                isFavorite: true // Set isFavorite to true
            });
            await newMovie.save();
            return res.status(201).json({ message: "Movie added to favorites", movie: newMovie });
        }

        // If the movie exists, toggle isFavorite
        movie.isFavorite = !movie.isFavorite;
        await movie.save();

        res.status(200).json({ message: `Movie ${movie.isFavorite ? 'added to' : 'removed from'} favorites`, movie });
    } catch (error) {
        console.error("Error toggling favorite:", error);
        res.status(500).json({ message: "Error toggling favorite" });
    }
};


const markAsWatched = async () => {
    if (!user || !user.token) {
        setMessage("User is not authenticated.");
        return;
    }

    try {
        const response = await fetch(`/user/watched`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                userId: user.userId,
                movieId: movieId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error marking as watched:", errorData.message);
            setMessage(errorData.message || "Failed to mark movie as watched.");
            return;
        }

        setMessage("Movie marked as watched!");
    } catch (error) {
        console.error("Error marking movie as watched:", error);
        setMessage("An error occurred. Please try again.");
    }
};



module.exports = { 
    getAllMovies,
    addToFavorites,
    markAsWatched
};