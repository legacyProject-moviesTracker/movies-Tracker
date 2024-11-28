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

module.exports = {
    registerUser,
    loginUser,
};