// route is for defining the end point of the app and also map them to a specific controller

import express from "express";

import {
  createTask,
  getAllTasksForASpecificUser,
  getASingleTaskByIdForASpecificUser,
  updateASingleTaskByIdForASpecificUser,
  deleteASingleTaskByIdForASpecificUser,
} from "../controller/taskController.js";

const route = express.Router();

// eta create er route
route.post("/createTask", createTask);

// ekta thakbe show all tasks
route.get("/tasks/:userId", getAllTasksForASpecificUser);

// ekta thakbe show a single task by id for a specific User
route.get("/task/:userId/:id", getASingleTaskByIdForASpecificUser);

// ekta thakbe update a task by id for a specific user
route.put("/task/:userId/:id", updateASingleTaskByIdForASpecificUser);

// ekta thakbe delete a task by id for a specific user
route.delete("/task/:userId/:id", deleteASingleTaskByIdForASpecificUser);

export default route;
