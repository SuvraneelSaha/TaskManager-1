// route is for defining the end point of the app and also map them to a specific controller

import express from "express";

import {
  createTask,
  getAllTasksForASpecificUser,
  getASingleTaskByIdForASpecificUser,
  updateASingleTaskByIdForASpecificUser,
  deleteASingleTaskByIdForASpecificUser,
} from "../controller/taskController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const route = express.Router();

// eta create er route
route.post("/createTask",authMiddleware, createTask);

// ekta thakbe show all tasks
route.get("/tasks",authMiddleware, getAllTasksForASpecificUser);

// ekta thakbe show a single task by id for a specific User
route.get("/task/:id",authMiddleware, getASingleTaskByIdForASpecificUser);

// ekta thakbe update a task by id for a specific user
route.put("/task/:id",authMiddleware, updateASingleTaskByIdForASpecificUser);

// ekta thakbe delete a task by id for a specific user
route.delete("/task/:id",authMiddleware, deleteASingleTaskByIdForASpecificUser);

export default route;
