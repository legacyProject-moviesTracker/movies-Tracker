import React, { useState } from "react";
import "../assets/styles/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <div className="search-bar-container">
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for movies, series, or people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="button-21">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
