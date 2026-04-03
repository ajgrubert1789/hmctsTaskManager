import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { BiCircle, BiChevronDownCircle, BiSolidTrash } from "react-icons/bi";
import CompletedTasks from "./components/CompletedTasks";
import ActiveTasks from "./components/ActiveTasks";
import AddTask from "./components/AddTask";
import UpdateTask from "./components/UpdateTask";

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
  
  
  const syncExpiredTasks = async (fetchedTasks) => {
  const now = new Date();

    const needsAutoUpdate = fetchedTasks.filter((task) => {
      
      if (
        !task.dueDateTime ||
        task.status === true ||
        task.isManualOverride === true
      ) {
        return false;
      }
      const dueDate = new Date(task.dueDateTime.replace(" ", "T"));
      return dueDate < now;
    });

    if (needsAutoUpdate.length > 0) {
      try {
        await Promise.all(
          needsAutoUpdate.map((t) =>
            axios.put(`http://localhost:8082/tasks/${t.taskId}`, {
              ...t,
              status: true,
            }),
          ),
        );
        // Fetch fresh data and set state directly to break the loop
        const finalResponse = await axios.get("http://localhost:8082/tasks");
        setTasks(finalResponse.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // -----------------------------
  // Fetch all tasks
  // -----------------------------
  const getAllTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8082/tasks");
      setTasks(response.data);
      syncExpiredTasks(response.data);
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

    // Ensure there is an ID to search for
    if (!searchId) {
      alert("Please enter a Task ID");
      return;
    }

    const existingTask = tasks.find((t) => t.taskId.toString() === searchId);

    if (!existingTask) {
      alert("Task ID not found!");
      return;
    }

    try {
      const payload = {
        taskId: existingTask.taskId,
        title: titleInput.trim() || existingTask.title,
        description: taskInput.trim() || existingTask.description,
        status: existingTask.status,
        dueDateTime: selectedDate
          ? selectedDate.replace("T", " ") + ":00"
          : existingTask.dueDateTime,
      };
      await axios.put(`http://localhost:8082/tasks/${searchId}`, payload);

      await getAllTasks();

      setTaskInput("");
      setTitleInput("");
      setSelectedDate("");
      setSearchId("");

      alert("Task updated!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed. Please check the console for details.");
    }
  };

  const toggleStatus = async (task) => {
    const { isExpired: _isExpired, ...taskData } = task;

    const isPastDue =
      task.dueDateTime &&
      new Date(task.dueDateTime.replace(" ", "T")) < new Date();
    const movingToActive = task.status === true; // true (done) -> false (active)

    try {
      await axios.put(`http://localhost:8082/tasks/${task.taskId}`, {
        ...taskData,
        status: !task.status,
        // If moving back to active while expired, trigger the shield
        isManualOverride:
          movingToActive && isPastDue ? true : task.isManualOverride,
      });

      await getAllTasks();
    } catch (error) {
      console.error("Manual toggle failed:", error);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setTaskInput("");
    setTitleInput("");
    setSelectedDate("");
    setSearchId("");
  };

  const tabList = [
    { id: "create", label: "Add" },
    { id: "update", label: "Update" },
    { id: "search-tasks", label: "Search" },
    { id: "completed", label: "Completed" },
  ];

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="container">
      <div className="task-header">
        <h1>HMCTS Task Manager</h1>
        <span>Remember, it's easy to forget.</span>
      </div>

      {/* Tabs */}
      <div className="tab-header">
        {tabList.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "tab-btn active" : "tab-btn"}
            onClick={() => {
              setActiveTab(tab.id);
              handleTabChange(tab.id);
              syncExpiredTasks(tasks); 
              
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === "create" && (
          <AddTask
            createTask={createTask}
            taskInput={taskInput}
            setTaskInput={setTaskInput}
            titleInput={titleInput}
            setTitleInput={setTitleInput}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}

        {activeTab === "update" && (
          <>
            <UpdateTask
              updateTask={updateTask}
              searchId={searchId}
              setSearchId={setSearchId}
              taskInput={taskInput}
              setTaskInput={setTaskInput}
              titleInput={titleInput}
              setTitleInput={setTitleInput}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              tasks={tasks}
            />
            <br />
            <ActiveTasks
              tasksWithExpiry={tasksWithExpiry}
              searchId={searchId}
              setSearchId={setSearchId}
              deleteTask={deleteTask}
              toggleStatus={toggleStatus}
            />
          </>
        )}

        {activeTab === "search-tasks" && (
          <ActiveTasks
            tasksWithExpiry={tasksWithExpiry}
            searchId={searchId}
            setSearchId={setSearchId}
            deleteTask={deleteTask}
            toggleStatus={toggleStatus}
          />
        )}

        {activeTab === "completed" && (
          <CompletedTasks
            tasksWithExpiry={tasksWithExpiry}
            searchId={searchId}
            setSearchId={setSearchId}
            deleteTask={deleteTask}
            toggleStatus={toggleStatus}
          />
        )}
      </div>
    </div>
  );
}

export default App;
