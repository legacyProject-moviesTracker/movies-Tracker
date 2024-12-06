const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String },
    releaseDate: { type: Date },
    posterUrl: { type: String },
    apiId: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    overview: { type: String }, 
    rating: { type: Number, min: 0, max: 10 }, 
    isFavorite: { type: Boolean, default: false }, 
    isWatched: { type: Boolean, default: false } 
});


const Movie = mongoose.model('Movie', moviesSchema);

module.exports = Movie;