import React, { useState } from "react";
import "../assets/styles/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query); // Trigger the search only if there's a query
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && query.trim()) {
      handleSearch(event); // Handle "Enter" key for searching
    }
  };

  return (
    <div className="search-bar-container">
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for movies, series, or people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className="button-21">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
