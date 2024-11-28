const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
    title: {String, required: true},
    genre: {type: String},
    releaseDate: {type: Date},
    posterUrl: {type: String},
    apiId: {type: String, unique: true, required: true },
});

const Movie = mongoose.model('Movie', userSchema);

module.exports = Movie;