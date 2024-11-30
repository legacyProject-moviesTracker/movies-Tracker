const User = require('../models/userModel');

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

// Controller to get user's favorites with full movie details
const getFavoritesWithDetails = async (req, res) => {
    const { userId } = req.query; // Get user ID from query parameters

    try {
        // Find user by ID and get favoriteMovies
        const user = await User.findById(_Id);

        console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { favoriteMovies } = user; // Array of movie IDs (numbers)

        if (!favoriteMovies || favoriteMovies.length === 0) {
            return res.status(404).json({ message: 'No favorite movies found.' });
        }

        // Fetch details for each movie ID
        const movieDetailsPromises = favoriteMovies.map((movieId) =>
            fetchMovieDetailsFromTMDB(movieId)
        );

        const movieDetails = await Promise.all(movieDetailsPromises);

        // Return combined details
        res.json(movieDetails);
    } catch (error) {
        console.error('Error fetching favorite movies:', error);
        res.status(500).json({ error: 'Failed to fetch favorite movies.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getFavoritesWithDetails,
};