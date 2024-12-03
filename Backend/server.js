const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const connection = require('./config/connection');
require('dotenv').config();
const userRoutes = require('./Routers/user.Router');
const movieRoutes = require('./Routers/movies.Router');
const commentsRoutes = require('./Routers/comments.Router');
const User = require('./models/userModel');

// initialize the app
const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Register a new user
app.post('/register', async(req, res) => {
    // let email = req.body.email;
    // let password = req.body.password;
    // let username = req.body.username;
    try {
        let {email, password, username} = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }
        let oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
    
        let hashedPassword = await bcrypt.hash(password, 10);
    
        await User.create({
            email,
            password: hashedPassword,
            username,
        });
        
        return res.send({message: "Registered succesfully"});
    } catch (error) {
        return res.status(500).send({msg: "Internal server error"});
    }
});

app.post('/login', async (req, res) => {
    try {
        let {email, password} = req.body;
    if(!email || !password) {
        return res.send({
            msg: "Please fill in all fields",
        });
    }
    let registeredUser = await User.findOne({email});
    if(!registeredUser) {
        return res.send({msg: "User not found, please register first"});
    }
    let isPasswordCorrect = await bcrypt.compare(
        password,
        registeredUser.password
    );
    if(!isPasswordCorrect) {
        return res.send({msg: "incorrect password"});
    }

    // Return Token (payload, secretkey)

    // Generate the Token
    let payload = {
        userId: registeredUser._id,
        email: registeredUser.email,
    }
    let token = jwt.sign(payload, "supersecretawesomness");

    return res.send({msg: "Logged in successfully", token});
    } catch (error) {
        return res.status(500).send({msg: "Internal server error"});
    }
});

app.use('/', userRoutes);
app.use('/movies', movieRoutes);
app.use('/', commentsRoutes);

app.get("/", (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});