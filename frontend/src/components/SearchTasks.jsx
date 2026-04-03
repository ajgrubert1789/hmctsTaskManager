import React from "react";

const SearchTasks = ({ searchId, setSearchId }) => {
  return (
    <div className="sticky-search">
      <h3>Search by ID:</h3>
      <br />
      <input
        className="id-search-bar"
        type="text"
        placeholder="Enter an ID to filter..."
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
    </div>
  );
};

export default SearchTasks;
