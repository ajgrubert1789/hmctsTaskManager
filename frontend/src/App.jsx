import { useEffect, useState, useMemo} from "react";
import axios from "axios";
import { BiCircle, BiChevronDownCircle, BiSolidTrash } from "react-icons/bi";

function App() {
  // -----------------------------
  // State
  // -----------------------------
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchId, setSearchId] = useState("");

  const [activeTab, setActiveTab] = useState("create"); 

  const now = new Date().toISOString().slice(0, 16);

  // -----------------------------
  // Fetch all tasks
  // -----------------------------
  const getAllTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8082/tasks");
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // -----------------------------
  // Load tasks on mount
  // -----------------------------
  useEffect(() => {
    const fetchTasks = async () => {
      await getAllTasks();
    };

    fetchTasks();
  }, []);




  

  // // -----------------------------
  // // Auto-mark expired tasks
  // // -----------------------------
  // const checkAndMarkExpiredTasks = async (taskList) => {
  //   const now = new Date();

  //   const expiredTasks = taskList.filter(task => {
  //     if (!task.dueDateTime || task.status === true) return false;
  //     const dueDate = new Date(task.dueDateTime.replace(" ", "T"));
  //     return dueDate < now;
  //   });

  //   if (expiredTasks.length > 0) {
  //     try {
  //       const updatePromises = expiredTasks.map(task =>
  //         axios.put(`http://localhost:8082/tasks/${task.taskId}`, {
  //           ...task,
  //           status: true
  //         })
  //       );

  //       await Promise.all(updatePromises);
  //       getAllTasks();
  //     } catch (error) {
  //       console.error("Error updating expired tasks:", error);
  //     }
  //   }
  // };

  const tasksWithExpiry = useMemo(() => {
    const now = new Date();
    return tasks.map((task) => {
      if (!task.dueDateTime) return { ...task, isExpired: false };

      const dueDate = new Date(task.dueDateTime.replace(" ", "T"));

      return {
        ...task,

        isExpired: dueDate < now && !task.status,
      };
    });
  }, [tasks]);

  // -----------------------------
  // Create Task
  // -----------------------------
  const createTask = async (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    try {
      const formattedDate = selectedDate
        ? selectedDate.replace("T", " ") + ":00"
        : null;

      await axios.post("http://localhost:8082/tasks", {
        title: titleInput,
        description: taskInput,
        status: false,
        dueDateTime: formattedDate,
      });

      setTaskInput("");
      setTitleInput("");
      setSelectedDate("");
      getAllTasks();
      alert("Task Added!");
    } catch (error) {
      console.log(error);
    }
  };

  // -----------------------------
  // Delete Task
  // -----------------------------
  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to proceed?")) return;

    try {
      await axios.delete(`http://localhost:8082/tasks/${taskId}`);
      getAllTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // -----------------------------
  // Update Task
  // -----------------------------
  const updateTask = async (e) => {
    e.preventDefault();

    const existingTask = tasks.find((t) => t.taskId.toString() === searchId);
    if (!existingTask) {
      alert("Task ID not found!");
      return;
    }

    try {
       const payload = {
  taskId: existingTask.taskId,
  // If the user typed something, use it; otherwise, keep the old one
  title: titleInput.trim() !== "" ? titleInput.trim() : existingTask.title,
  description: taskInput.trim() !== "" ? taskInput.trim() : existingTask.description,
  status: existingTask.status,
  dueDateTime: selectedDate
    ? selectedDate.replace("T", " ") + ":00"
    : existingTask.dueDateTime,
};

      // 1. Wait for the server to finish the update
      await axios.put(`http://localhost:8082/tasks/${searchId}`, payload);

      // 2. IMPORTANT: Wait for the fresh data to be saved into React State
      await getAllTasks(); 

      // 3. NOW clear the inputs and alert
      setTaskInput("");
      setTitleInput("");
      setSelectedDate(""); // Clear this too
      setSearchId(""); 
      
      alert("Task updated!");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  

  const toggleStatus = async (task) => {
    // Use _isExpired to tell the linter you are intentionally ignoring it
    const { isExpired: _isExpired, ...taskData } = task;

    try {
      await axios.put(`http://localhost:8082/tasks/${task.taskId}`, {
        ...taskData,
        status: !task.status,
      });
      getAllTasks();
    } catch (error) {
      console.error("Error flipping status:", error);
    }
  };

  const tabList = [
    { id: "create", label: "Add" },
    { id: "update", label: "Update" },
    { id: "search-tasks", label: "Search" },
    {id:"completed", label:"Completed"}
  ];

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="container">
      <div className="task-header">
        <h1>HMCTS Task Manager</h1>
        <span>Remember, it's easy to forget...</span>
      </div>

      {/* Tabs */}
      <div className="tab-header">
        {tabList.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === "create" && (
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
          
          
        )}

        {activeTab === "update" && (
          <div className="update-container">
            <form className="task-form" onSubmit={updateTask}>
              <h3>Update Task:</h3>

              <input
                className="id-search-bar"
                type="text"
                placeholder="Enter an ID to Edit"
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
            
            <br />
            
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

            <ul className="task-list">
              {tasksWithExpiry
              .filter((task) => task.status === false)
                .filter(
                  (task) =>
                    searchId === "" || task.taskId.toString() === searchId,
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

                    <textarea className="task-li-text" readOnly key={task.description} value={task.description} >
                      {task.description}
                    </textarea>

                    <div className="task-btns">
                      <button
                        className="delete-btn"
                        onClick={() => deleteTask(task.taskId)}
                      >
                        <BiSolidTrash />
                      </button>
                      <button
                        className="done-btn"
                        onClick={() => toggleStatus(task)}
                      >
                        {task.status ? <BiChevronDownCircle /> : <BiCircle />}
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

            {/* <div className="list-section">
              <h3>All Tasks:</h3>

              <ul className="task-list">
                <div className="sticky-search-container">
                  <h3>Search by ID:</h3>

                  <input
                    className="id-search-bar"
                    type="text"
                    placeholder="Enter an ID to Edit"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                  />
                </div>

                {tasks
                  .filter(
                    (task) =>
                      searchId === "" || task.taskId.toString() === searchId,
                  )
                  .map((task) => (
                    <li
                      key={task.taskId}
                      className={`task-item ${task.status ? "task-completed" : ""}`}
                    >
                      <h3 className="task-header">
                        <span>Task ID: {task.taskId}</span>
                        <span>Task Title: {task.title}</span>
                        <span>Due Date: {task.dueDateTime.slice(0, 10)}</span>
                        <span>Due Time: {task.dueDateTime.slice(11, 16)}</span>
                      </h3>

                      <hr className="task-divider" />

                      <textarea className="task-li-text" readOnly>
                        {task.description}
                      </textarea>

                      <div className="task-btns">
                        <button
                          className="delete-btn"
                          onClick={() => deleteTask(task.taskId)}
                        >
                          <BiSolidTrash />
                        </button>

                        <button
                          className="done-btn"
                          onClick={() => toggleStatus(task)}
                        >
                          {task.status ? <BiChevronDownCircle /> : <BiCircle />}
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div> */}
          </div>
        )}
        {activeTab === "search-tasks" && (
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

            <ul className="task-list">
              {tasksWithExpiry
              .filter((task) => task.status === false)
                .filter(
                  (task) =>
                    searchId === "" || task.taskId.toString() === searchId,
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

                    <textarea className="task-li-text" readOnly>
                      {task.description}
                    </textarea>

                    <div className="task-btns">
                      <button
                        className="delete-btn"
                        onClick={() => deleteTask(task.taskId)}
                      >
                        <BiSolidTrash />
                      </button>
                      <button
                        className="done-btn"
                        onClick={() => toggleStatus(task)}
                      >
                        {task.status ? <BiChevronDownCircle /> : <BiCircle />}
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {activeTab === "completed" && (
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

            <ul className="task-list">
              {tasksWithExpiry
                .filter((task) => task.status === true)
                .filter(
                  (task) =>
                    searchId === "" || task.taskId.toString() === searchId,
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

                    <textarea className="task-li-text" readOnly>
                      {task.description}
                    </textarea>

                    <div className="task-btns">
                      <button
                        className="delete-btn"
                        onClick={() => deleteTask(task.taskId)}
                      >
                        <BiSolidTrash />
                      </button>
                      <button
                        className="done-btn"
                        onClick={() => toggleStatus(task)}
                      >
                        {task.status ? <BiChevronDownCircle /> : <BiCircle />}
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
