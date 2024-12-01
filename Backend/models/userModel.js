const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowerCase: true},
    password: {type: String, required: true},
    favoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
    watchedMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
    prioritylist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
});

const User = mongoose.model('User', userSchema);

module.exports = User;