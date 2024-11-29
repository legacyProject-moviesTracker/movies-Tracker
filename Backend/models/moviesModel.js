const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
    title: {type: String, required: true},
    genre: {type: String},
    releaseDate: {type: Date},
    posterUrl: {type: String},
    apiId: {type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Movie = mongoose.model('Movie', moviesSchema);

module.exports = Movie;