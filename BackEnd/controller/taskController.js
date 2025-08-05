// controller is for handiling the request and processing the data and also generating of Response also 
import Task from "../model/taskModel.js";

// add the data into the database 


export const createTask = async (request, response) => {
  try {
    const { title, dueDate, completed, userId } = request.body;

    if (!title || !userId) {
      return response.status(400).json({ error: "Title and userId are required." });
    }

    const task = new Task({ title, dueDate, completed, userId });
    await task.save();

    response.status(201).json(task);
  } catch (error) {
    response.status(500).json({ error: "Failed to create task", details: error.message });
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
    response.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};