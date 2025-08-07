// backend/testApp.js
// Separate app configuration for testing to avoid port conflicts

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import taskRoute from "./routes/taskRoute.js";
import userRoute from "./routes/userRoute.js";

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api", taskRoute);
app.use("/api/user", userRoute);

// Root route
app.get("/", (req, res) => {
  res.send("Test API is running...");
});

// 404 handler for tests
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
