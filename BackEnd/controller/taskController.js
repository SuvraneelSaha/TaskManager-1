// controller is for handiling the request and processing the data and also generating of Response also
import Task from "../model/taskModel.js";
import User from "../model/userModel.js";

// add the data into the database

// Create a task for a specific user
export const createTask = async (request, response) => {
  try {
    const { title, dueDate, completed, userId } = request.body;

    if (!title || !userId) {
      return response
        .status(400)
        .json({ error: "Title and userId are required." });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return response.status(404).json({ error: "User not found." });
    }

    const task = new Task({ title, dueDate, completed, userId });
    await task.save();

    response.status(201).json(task);
  } catch (error) {
    response
      .status(500)
      .json({ error: "Failed to create task", details: error.message });
  }
};

// Get all tasks for a specific user
export const getAllTasksForASpecificUser = async (request, response) => {
  try {
    const { userId } = request.params;

    if (!userId) {
      return response.status(400).json({ error: "User ID is required." });
    }

    const tasks = await Task.find({ userId });

    response.status(200).json(tasks);
  } catch (error) {
    response
      .status(500)
      .json({ error: "Failed to fetch tasks", details: error.message });
  }
};

// Get a single task by task ID and user ID
export const getASingleTaskByIdForASpecificUser = async (request, response) => {
  try {
    const { id, userId } = request.params;

    if (!id || !userId) {
      return response
        .status(400)
        .json({ error: "Task ID and User ID are required." });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return response.status(404).json({ error: "User not found." });
    }

    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      return response
        .status(404)
        .json({ error: "Task not found for this user." });
    }

    response.status(200).json(task);
  } catch (error) {
    response
      .status(500)
      .json({ error: "Failed to fetch task", details: error.message });
  }
};

export const updateASingleTaskByIdForASpecificUser = async (
  request,
  response
) => {
  try {
    const { userId, id } = request.params;
    const { title, dueDate, completed } = request.body;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return response.status(404).json({ error: "User not found." });
    }

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return response
        .status(404)
        .json({ error: "Task not found for this user." });
    }

    if (
      title === undefined &&
      dueDate === undefined &&
      completed === undefined
    ) {
      return response.status(400).json({
        error:
          "At least one field (title, dueDate, completed) should be provided to make the  update.",
      });
    }

    if (title !== undefined) task.title = title.trim();
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (completed !== undefined) task.completed = completed;

    await task.save();

    response.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    response
      .status(500)
      .json({ error: "Failed to update task", details: error.message });
  }
};

export const deleteASingleTaskByIdForASpecificUser = async (
  request,
  response
) => {
  try {
    const { userId, id } = request.params;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return response.status(404).json({ error: "User not found." });
    }

    const deletedTask = await Task.findOneAndDelete({ _id: id, userId });
    if (!deletedTask) {
      return response
        .status(404)
        .json({ error: "Task not found for this user." });
    }

    response.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    response
      .status(500)
      .json({ error: "Failed to delete task", details: error.message });
  }
};
