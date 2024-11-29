const API_KEY = '1d96b86ca67b80b6ffe19947686664ef'; 
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Fetch movies from a specific endpoint.
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @returns {Promise<Array>} - A promise that resolves to an array of movies.
 */
export const fetchMovies = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results; // Return only the results array
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

/**
 * Fetch details of a specific movie.
 * @param {number} movieId - The ID of the movie to fetch.
 * @returns {Promise<Object|null>} - A promise that resolves to the movie details object.
 */
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const data = await response.json();
    return {
      title: data.title,
      releaseDate: data.release_date,
      genre: data.genres.map((g) => g.name).join(", "),
      rating: Math.round(data.vote_average * 10), // Convert to percentage
      overview: data.overview,
      posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
    };
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

/**
 * Fetch cast of a specific movie.
 * @param {number} movieId - The ID of the movie to fetch cast for.
 * @returns {Promise<Array>} - A promise that resolves to an array of cast members.
 */
export const fetchMovieCast = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
    const data = await response.json();
    return data.cast.map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character,
      profileUrl: member.profile_path
        ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
        : "https://via.placeholder.com/150", // Placeholder if no image
    }));
  } catch (error) {
    console.error("Error fetching movie cast:", error);
    return [];
  }
};

/**
 * Fetch genres of movies.
 * @returns {Promise<Array>} - A promise that resolves to an array of genres.
 */
export const fetchGenres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await response.json();
    return data.genres; // Return the array of genres
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};
