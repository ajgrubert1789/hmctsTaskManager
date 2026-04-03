import React from "react";
import { BiCircle, BiChevronDownCircle, BiSolidTrash } from "react-icons/bi";
import SearchTasks from "./SearchTasks";

const CompletedTasks = ({
  searchId,
  setSearchId,
  tasksWithExpiry,
  deleteTask,
  toggleStatus,
}) => {
  return (
    <div className="tasks-container">
      <SearchTasks searchId={searchId} setSearchId={setSearchId} />

      <ul className="task-list">
        {tasksWithExpiry
          .filter((task) => task.status === true)
          .filter(
            (task) => searchId === "" || task.taskId.toString() === searchId,
          )
          .map((task) => (
            <li
              key={task.taskId}
              className={`task-item ${task.status ? "task-completed" : ""} ${task.isExpired ? "task-expired" : ""}`}
            >
              <h3 className="task-header">
                <span>Task ID: {task.taskId}</span>
                <span>Task Title: {task.title}</span>
                <span>Due Date: {task.dueDateTime.slice(0, 10)}</span>
                <span>Due Time: {task.dueDateTime.slice(11, 16)}</span>
              </h3>

              <hr className="task-divider" />

              <textarea
                className="task-li-text"
                value={task.description || ""}
                readOnly
              />

              <div className="task-btns">
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.taskId)}
                >
                  <BiSolidTrash />
                </button>
                <button className="done-btn" onClick={() => toggleStatus(task)}>
                  {task.status ? <BiChevronDownCircle /> : <BiCircle />}
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CompletedTasks;
