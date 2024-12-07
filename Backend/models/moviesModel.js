const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String },
  releaseDate: { type: Date },
  posterUrl: { type: String },
  favorite: Boolean,
  watched: Boolean,
  comment: String,
  apiId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Movie = mongoose.model("Movie", moviesSchema);

module.exports = Movie;
