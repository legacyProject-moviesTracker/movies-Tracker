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

module.exports = {
  login,
  register,
  getAllUsers,
};
