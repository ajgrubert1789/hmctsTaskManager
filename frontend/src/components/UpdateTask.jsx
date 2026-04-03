import React from "react";

function UpdateTask({
  updateTask,
  searchId,
  setSearchId,
  taskInput,
  setTaskInput,
  titleInput,
  setTitleInput,
  selectedDate,
  setSelectedDate,
}) {
  const now = new Date().toISOString().slice(0, 16);
  return (
    <div className="update-container">
      <form className="task-form" onSubmit={updateTask}>
        <h3>Update Task:</h3>

        <input
          className="id-search-bar"
          type="text"
          placeholder="Enter ID to update"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        <div className="input-group">
          <label>Task Title</label>
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Name of your task?"
          />
        </div>

        <div className="input-group">
          <label>Due Date & Time</label>
          <input
            type="datetime-local"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={now}
          />
        </div>

        <div className="input-group">
          <label>Description ({taskInput.length}/500)</label>
          <textarea
            className="description-text-area"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            maxLength={500}
            placeholder="Add more details..."
            rows={4}
          />
        </div>

        <button id="update-task-button" type="submit">
          Update Task
        </button>
      </form>
    </div>
  );
}

export default UpdateTask;
