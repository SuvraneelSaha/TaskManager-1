// route is for defining the end point of the app and also map them to a specific controller

import express from "express";

import { createTask , getAllTasksForASpecificUser } from "../controller/taskController.js";

const route = express.Router();

// eta create er route 
route.post("/createTask", createTask);

// ekta thakbe show all tasks 
route.get("/tasks/:userId", getAllTasksForASpecificUser);

// ekta thakbe show a single task by id 

// ekta thakbe update a task by id 

// ekta thakbe delete a task by id 



export default route;
