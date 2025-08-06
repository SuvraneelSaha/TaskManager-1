import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserDashboard() {
  const [user, setUser] = useState({ email: "" });
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "completed", "pending"
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    taskId: null,
    taskTitle: "",
  });
  const navigate = useNavigate();

  // Verify token and fetching the user tasks
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // const payload = JSON.parse(atob(token.split(".")[1]));
      fetchUserTasks(token);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch user's tasks
  const fetchUserTasks = async (token) => {
    try {
      const response = await fetch("http://localhost:8000/api/tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setTasks(data);
        setFilteredTasks(data);

        if (data.length > 0) {
          const token = localStorage.getItem("token");
          const payload = JSON.parse(atob(token.split(".")[1]));

          setUser({ email: payload.email });
        }
      } else {
        setError(data.error || "Failed to fetch tasks");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Fetch tasks error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on status and search term
  useEffect(() => {
    let filtered = tasks;

    // Filter by status
    if (filterStatus === "completed") {
      filtered = filtered.filter((task) => task.completed);
    } else if (filterStatus === "pending") {
      filtered = filtered.filter((task) => !task.completed);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, filterStatus, searchTerm]);

  // Handle task deletion - open modal
  const handleDeleteTask = (taskId, taskTitle) => {
    setDeleteModal({ isOpen: true, taskId, taskTitle });
  };

  // Confirm delete task
  const confirmDeleteTask = async () => {
    const { taskId } = deleteModal;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/api/task/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove task from state
        setTasks(tasks.filter((task) => task._id !== taskId));
        setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" });
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete task");
        setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" });
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Delete task error:", error);
      setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" });
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1f1f1f] flex items-center justify-center">
        <div className="text-xl text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1f1f1f]">
      {/* Header Section */}
      <header className="bg-[#2a2a2a] border-b border-gray-700 text-white py-6 px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <i className="fa-solid fa-pen-nib text-2xl text-[#81E6D9]"></i>
            <span className="text-2xl font-bold">TaskTracker</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-lg">Welcome, {user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Create Task Button */}
        <div className="mb-8">
          <Link
            to="/userDashBoard/createTask"
            className="inline-block bg-[#3182CE] text-white px-6 py-3 rounded-lg hover:bg-[#2B6CB0] transition font-semibold"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Create New Task
          </Link>
        </div>

        {/* Filters and Search - Updated Layout */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Status Filter - Left Side */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === "all"
                  ? "bg-[#3182CE] text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === "pending"
                  ? "bg-[#3182CE] text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === "completed"
                  ? "bg-[#3182CE] text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
              }`}
            >
              Completed
            </button>
          </div>

          {/* Search Input - Right Side */}
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#81E6D9] transition placeholder-gray-400"
            />
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Serial No.
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Task Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      {tasks.length === 0
                        ? "No tasks found. Create your first task!"
                        : "No tasks match your current filters."}
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task, index) => (
                    <tr
                      key={task._id}
                      className="border-b border-gray-700 hover:bg-gray-750"
                    >
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {task.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {formatDate(task.dueDate)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.completed
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {task.completed ? "Completed" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex justify-center space-x-2">
                          <Link
                            to={`/userDashBoard/editTask/${task._id}`}
                            className="flex items-center px-3 py-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-all duration-200 text-base"
                            title="Edit task"
                          >
                            <i className="fa-solid fa-pen text-base mr-1.5"></i>
                            Edit
                          </Link>
                          <button
                            onClick={() =>
                              handleDeleteTask(task._id, task.title)
                            }
                            className="flex items-center px-3 py-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-all duration-200 text-base"
                            title="Delete task"
                          >
                            <i className="fa-solid fa-trash text-base mr-1.5"></i>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tasks Summary */}
        <div className="mt-6 text-sm text-gray-400">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center mb-4">
              <i className="fa-solid fa-triangle-exclamation text-red-500 text-xl mr-3"></i>
              <h3 className="text-lg font-semibold text-white">
                Confirm Delete
              </h3>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the task{" "}
              <span className="font-medium text-white">
                "{deleteModal.taskTitle}"
              </span>
              ?
              <hr />
              <span className="text-sm text-gray-400 mt-2 block">
                This action cannot be undone.
              </span>
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
