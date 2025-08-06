import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditUserTask() {
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    completed: false,
  });
  const [loading, setLoading] = useState(false);
  const [fetchingTask, setFetchingTask] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [taskNotFound, setTaskNotFound] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // Get task ID from URL

  // Check authentication when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp < currentTime) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setIsAuthenticating(false);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch task data when component mounts and authentication is verified
  useEffect(() => {
    if (!isAuthenticating && id) {
      fetchTaskData();
    }
  }, [isAuthenticating, id]);

  const fetchTaskData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/api/task/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        // Format date for input field
        const formattedDate = data.dueDate
          ? new Date(data.dueDate).toISOString().split("T")[0]
          : "";

        setFormData({
          title: data.title,
          dueDate: formattedDate,
          completed: data.completed,
        });
      } else {
        if (response.status === 404) {
          setTaskNotFound(true);
        } else {
          setError(data.error || "Failed to fetch task details");
        }
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Fetch task error:", error);
    } finally {
      setFetchingTask(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const updateData = {
        title: formData.title.trim(),
        dueDate: formData.dueDate || null,
        completed: formData.completed,
      };

      const response = await fetch(`http://localhost:8000/api/task/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/userDashBoard");
        }, 1500);
      } else {
        setError(data.error || "Failed to update task");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Update task error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format today's date for min attribute
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Show loading while checking authentication
  if (isAuthenticating || fetchingTask) {
    return (
      <div className="min-h-screen bg-[#1f1f1f] flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-[#81E6D9] mb-4"></i>
          <p className="text-xl text-gray-300">
            {isAuthenticating ? "Authenticating..." : "Loading task details..."}
          </p>
        </div>
      </div>
    );
  }

  // Show task not found message
  if (taskNotFound) {
    return (
      <div className="min-h-screen bg-[#1f1f1f]">
        <header className="bg-[#2a2a2a] border-b border-gray-700 text-white py-6 px-8">
          <div className="flex justify-between items-center">
            <Link to="/userDashBoard" className="flex items-center space-x-3">
              <i className="fa-solid fa-pen-nib text-2xl text-[#81E6D9]"></i>
              <span className="text-2xl font-bold">TaskTracker</span>
            </Link>
            <Link
              to="/userDashBoard"
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to Dashboard
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-8 py-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
              <i className="fa-solid fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
              <h2 className="text-2xl font-bold text-white mb-4">
                Task Not Found
              </h2>
              <p className="text-gray-300 mb-6">
                The task you're looking for doesn't exist or you don't have
                permission to edit it.
              </p>
              <Link
                to="/userDashBoard"
                className="bg-[#3182CE] text-white px-6 py-3 rounded-lg hover:bg-[#2B6CB0] transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1f1f1f]">
      {/* Header Section */}
      <header className="bg-[#2a2a2a] border-b border-gray-700 text-white py-6 px-8">
        <div className="flex justify-between items-center">
          <Link to="/userDashBoard" className="flex items-center space-x-3">
            <i className="fa-solid fa-pen-nib text-2xl text-[#81E6D9]"></i>
            <span className="text-2xl font-bold">TaskTracker</span>
          </Link>
          <Link
            to="/userDashBoard"
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-8 py-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Edit Task
          </h2>

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200">
              <i className="fa-solid fa-check-circle mr-2"></i>
              Task updated successfully! Redirecting to dashboard...
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
              <i className="fa-solid fa-exclamation-triangle mr-2"></i>
              {error}
            </div>
          )}

          <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Task Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter task title..."
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#81E6D9] transition placeholder-gray-400"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={getTodayDate()}
                  className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#81E6D9] transition"
                  disabled={loading}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Leave empty if no due date is required
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="completed"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-5 h-5 text-[#3182CE] bg-gray-900 border-gray-600 rounded focus:ring-[#81E6D9] focus:ring-2"
                />
                <label
                  htmlFor="completed"
                  className="text-sm font-medium text-gray-300"
                >
                  Mark as completed
                </label>
              </div>

              {/* Status Display */}
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Current Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      formData.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {formData.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3182CE] text-white py-3 rounded-lg hover:bg-[#2B6CB0] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Updating Task...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-save mr-2"></i>
                      Update Task
                    </>
                  )}
                </button>

                <Link
                  to="/userDashBoard"
                  className="block w-full text-center bg-gray-700 text-gray-300 py-3 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUserTask;
