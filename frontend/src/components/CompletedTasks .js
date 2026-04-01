// src/components/CompletedTasks.js
import React from "react";
import TaskList from "./TaskList";

const CompletedTasks = ({
  searchId,
  setSearchId,
  tasksWithExpiry,
  deleteTask,
  toggleStatus
}) => {
  return (
    <div className="tasks-container">
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

      <TaskList
        tasksWithExpiry={tasksWithExpiry.filter((t) => t.status === true)}
        searchId={searchId}
        deleteTask={deleteTask}
        toggleStatus={toggleStatus}
      />
    </div>
  );
};

export default CompletedTasks;