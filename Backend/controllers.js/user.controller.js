const User = require('../models/userModel');
const Movie = require('../models/moviesModel');

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            username,
            email,
            password,
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (password !== user.password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({message: 'Login successful'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
}

const addFavoriteMovie = async (req, res) => {
    const { userId, movieId } = req.body; // Get userId and movieId from the request body

    try {
        // Find user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the movie by movieId in the movie collection (assuming the movie is already saved in the database)
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Check if the movie is already in the user's favorites
        if (user.favoriteMovies.includes(movieId)) {
            return res.status(400).json({ message: 'Movie is already in the favorites list' });
        }

        // Add the movieId to the user's favoriteMovies array
        user.favoriteMovies.push(movieId);

        // Save the updated user
        await user.save();

        // Return success response
        res.status(200).json({ message: 'Movie added to favorites', user });
    } catch (error) {
        console.error('Error adding favorite movie:', error);
        res.status(500).json({ message: 'Failed to add movie to favorites' });
    }
};

const getFavoritesWithDetails = async (req, res) => {
    const { id } = req.params; // Get user ID from the route parameters

    try {
        // Find user by ID and populate favoriteMovies
        const user = await User.findById(id).populate('favoriteMovies'); // Populate with movie details

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If the user has favorite movies, return them
        if (user.favoriteMovies && user.favoriteMovies.length > 0) {
            res.json(user.favoriteMovies); // Return populated movie details
        } else {
            res.status(404).json({ message: 'No favorite movies found for this user.' });
        }
    } catch (error) {
        console.error('Error fetching favorite movies:', error);
        res.status(500).json({ error: 'Failed to fetch favorite movies.' });
    }
};

// Function to add movie to watchlist
const addToWatchlist = async (req, res) => {
    const { userId, movieId } = req.body;  // Assuming you're passing both userId and movieId in the body

    try {
        // Find the user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if movie is already in watchlist
        if (user.watchedMovies.includes(movieId)) {
            return res.status(400).json({ message: 'Movie already in watchlist' });
        }

        // Add movie to the watchlist
        user.watchedMovies.push(movieId);

        await user.save();  // Save the updated user

        res.status(200).json({ message: 'Movie added to watchlist successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding movie to watchlist' });
    }
};

const getWatchlist = async (req, res) => {
    const { id } = req.params; // Get user ID from the URL parameter

    try {
        const user = await User.findById(id).populate('watchedMovies'); // Use the ID from the request
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // WatchedMovies is stored as an array of movie IDs or references
        const { watchedMovies } = user;
        res.json(watchedMovies);
    } catch (error) {
        console.error('Error fetching watchedMovies:', error);
        res.status(500).json({ error: 'Failed to fetch watchlist.' });
    }
};

const deleteFavorite = async (req, res) => {
    const { userId, favoriteMovieId } = req.body; // Get userId and favoriteMovieId from the request body

    try {
        // Find the user by their ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the favoriteMovieId from the favoriteMovies array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { favoriteMovies: favoriteMovieId } },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Failed to remove the movie from favorites' });
        }

        res.json({ message: 'Movie removed from favorites', updatedUser });
    } catch (error) {
        console.error('Error removing movie from favorites:', error);
        res.status(500).json({ error: 'Failed to delete favorite movie' });
    }
};

const deleteWatchedMovie = async (req, res) => {
    const { userId, watchedMovieId } = req.body; // Destructure userId and watchedMovieId from the request body

    try {
        // Find the user by their ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the movie from the user's watchedMovies array
        const updatedWatchedMovies = user.watchedMovies.filter(movieId => movieId.toString() !== watchedMovieId);

        // Update the user's watchedMovies array
        user.watchedMovies = updatedWatchedMovies;

        // Save the updated user document
        await user.save();

        return res.status(200).json({ message: 'Movie removed from watchlist', watchedMovies: user.watchedMovies });
    } catch (error) {
        console.error('Error removing movie from watchlist:', error);
        res.status(500).json({ error: 'Failed to delete watched movie' });
    }
};

const createComments = async (req, res) => {
    
}

module.exports = {
    registerUser,
    loginUser,
    getFavoritesWithDetails,
    addFavoriteMovie,
    addToWatchlist,
    getWatchlist,
    deleteFavorite,
    deleteWatchedMovie,
    createComments,
};