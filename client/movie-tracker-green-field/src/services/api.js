const API_KEY = "66cdc96edb001c933831baa3d41ebcdd";
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Fetch movies from a specific endpoint.
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @returns {Promise<Array>} - A promise that resolves to an array of movies.
 */
export const fetchMovies = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}?api_key=${API_KEY}`);
    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

/**
 * Fetch free-to-watch movies.
 * @returns {Promise<Array>} - A promise that resolves to an array of free-to-watch movies.
 */
export const fetchFreeToWatchMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_watch_monetization_types=free`
    );
    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error("Error fetching free-to-watch movies:", error);
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
    // Reusable Authorization token
    const TMDB_AUTH_TOKEN =
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmNkYzk2ZWRiMDAxYzkzMzgzMWJhYTNkNDFlYmNkZCIsIm5iZiI6MTczMzUwNjEyNy45MSwic3ViIjoiNjc1MzM0NGY4NGNhOTI4ZDAwY2EwZjY3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.rRUc7oSgPwwoFi-xUFaCbMTfg5Y97PQpiRCzbrR0vck";

    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: TMDB_AUTH_TOKEN,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    return {
      title: data.title,
      releaseDate: data.release_date,
      genre: data.genres.map((g) => g.name).join(", "),

      rating: Math.round(data.vote_average * 10),

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
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.cast.map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character,
      profileUrl: member.profile_path
        ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
        : "https://via.placeholder.com/150",
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
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    const data = await response.json();

    return data.genres || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

/**
 * Search for movies globally.
 * @param {string} query - The search query (movie title).
 * @returns {Promise<Array>} - A promise that resolves to an array of movies.
 */
export const searchMovies = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

/**
 * Fetch related movies for a specific movie.
 * @param {number} movieId - The ID of the movie to fetch related movies for.
 * @returns {Promise<Array>} - A promise that resolves to an array of related movies.
 */
export const fetchRelatedMovies = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      posterUrl: `https://image.tmdb.org/t/p/w200${movie.poster_path}`,
    }));
  } catch (error) {
    console.error("Error fetching related movies:", error);
    return [];
  }
};
