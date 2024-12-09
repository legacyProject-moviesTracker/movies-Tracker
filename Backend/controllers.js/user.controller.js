const User = require("../models/userModel");
const Movie = require("../models/moviesModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
const register = async (req, res) => {
  try {
    let { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    let oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUND);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });
    // Generate the Token
    let payload = {
      userId: newUser._id,
      email: newUser.email,
      username: newUser.username,
    };
    let token = await jwt.sign(payload, process.env.SECRET_KEY);

    return res.send({ message: "Registered successfully", token });
  } catch (error) {
    return res.status(500).send({ msg: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.send({
        msg: "Please fill in all fields",
      });
    }
    let registeredUser = await User.findOne({ email });
    if (!registeredUser) {
      return res.send({ msg: "User not found, please register first" });
    }
    let isPasswordCorrect = await bcrypt.compare(
      password,
      registeredUser.password
    );
    if (!isPasswordCorrect) {
      return res.send({ msg: "incorrect password" });
    }

    // Generate the Token
    let payload = {
      userId: registeredUser._id,
      email: registeredUser.email,
      username: registeredUser.username,
    };
    let token = await jwt.sign(payload, process.env.SECRET_KEY);

    return res.send({ msg: "Logged in successfully", token });
  } catch (error) {
    return res.status(500).send({ msg: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    // console.log(allUsers);
    return res.send({ msg: "Users retrieved successfully", allUsers });
  } catch (error) {
    return res.status(500).send({ msg: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.userId; // Extract userId from params
  // console.log("Received userId:", userId); // Debugging log

  try {
    const user = await User.findById(userId); // Use findById for MongoDB's _id field

    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }

    return res.status(200).send({ msg: "User retrieved successfully", user });
  } catch (error) {
    console.error("Error in getUserById:", error); // Log error for debugging
    return res.status(500).send({ msg: "Internal server error" });
  }
};


// Update user information
const updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { username, email, password } = req.body;

  try {
    const updates = { username, email };
    if (password) {
      updates.password = await bcrypt.hash(password, +process.env.SALT_ROUND);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).send({ msg: "User not found" });
    }

    return res.status(200).send({ msg: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send({ msg: "Internal server error" });
  }
};

module.exports = {
  login,
  register,
  getAllUsers,
  getUserById,
  updateUser,
};
