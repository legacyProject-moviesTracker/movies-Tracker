const User = require("../models/userModel");
const Movie = require("../models/moviesModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



// Register a new user
const register = async (req, res) => {
  // let email = req.body.email;
  // let password = req.body.password;
  // let username = req.body.username;
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

    await User.create({
      email,
      password: hashedPassword,
      username,
    });

    return res.send({ message: "Registered succesfully" });
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

    // Return Token (payload, secretkey)

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

module.exports = {
  login,
  register
};
