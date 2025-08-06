import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function CreateTask() {
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

      const response = await fetch("http://localhost:8000/api/createTask", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          dueDate: formData.dueDate || undefined, // Send undefined if no date selected
        }),
      });

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        // Task created successfully
        setSuccess(true);
        // Reset form
        setFormData({ title: "", dueDate: "" });
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/userDashBoard");
        }, 1500);
      } else {
        // Task creation failed
        setError(data.error || "Failed to create task");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Create task error:", error);
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
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-[#1f1f1f] flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-[#81E6D9] mb-4"></i>
          <p className="text-xl text-gray-300">Loading...</p>
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
            Create New Task
          </h2>

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200">
              <i className="fa-solid fa-check-circle mr-2"></i>
              Task created successfully! Redirecting to dashboard...
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
                  Task Title * Mandatory
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

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3182CE] text-white py-3 rounded-lg hover:bg-[#2B6CB0] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Creating Task...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-plus mr-2"></i>
                      Create Task
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

export default CreateTask;
