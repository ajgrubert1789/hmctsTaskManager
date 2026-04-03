import React from "react";

function AddTask({
  createTask,
  taskInput,
  setTaskInput,
  titleInput,
  setTitleInput,
  selectedDate,
  setSelectedDate,
}) {
  const now = new Date().toISOString().slice(0, 16);
  return (
    <form className="task-form" onSubmit={createTask}>
      <h3>Add New Task:</h3>

      <div className="input-group">
        <label>Task Title</label>
        <input
          type="text"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          placeholder="Name of your task?"
          required
        />
      </div>

      <div className="input-group">
        <label>Due Date & Time</label>
        <input
          type="datetime-local"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={now}
          required
        />
      </div>

      <div className="input-group">
        <label>Description (Max 500 chars)</label>
        <textarea
          className="description-text-area"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          maxLength={500}
          placeholder="Add more details..."
          rows={4}
          required
        />
        <small className="char-count">{taskInput.length}/500</small>
      </div>

      <button id="add-task-button" type="submit">
        Add Task
      </button>
    </form>
  );
}

export default AddTask;
