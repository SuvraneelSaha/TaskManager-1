import request from "supertest";
import mongoose from "mongoose";
import app from "../testApp.js"; // We'll create this
import User from "../model/userModel.js";
import Task from "../model/taskModel.js";

// Test database URL - use a separate test database
const TEST_DB_URL =
  process.env.TEST_MONGO_URL || "mongodb://localhost:27017/tasktracker_test";

describe("Task Tracker API Tests", () => {
  let authToken;
  let userId;
  let taskId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(TEST_DB_URL);
  });

  beforeEach(async () => {
    // Clean up database before each test
    await User.deleteMany({});
    await Task.deleteMany({});
  });

  afterAll(async () => {
    // Clean up and close database connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe("User Authentication", () => {
    const testUser = {
      email: "test@example.com",
      password: "testpassword123",
    };

    test("POST /api/user/registerUser - should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/user/registerUser")
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
      expect(response.body).toHaveProperty("userId");

      // Verify user is created in database
      const user = await User.findOne({ email: testUser.email });
      expect(user).toBeTruthy();
      expect(user.email).toBe(testUser.email);

      userId = response.body.userId;
    });

    test("POST /api/user/registerUser - should fail with duplicate email", async () => {
      // First registration
      await request(app)
        .post("/api/user/registerUser")
        .send(testUser)
        .expect(201);

      // Second registration with same email should fail
      const response = await request(app)
        .post("/api/user/registerUser")
        .send(testUser)
        .expect(409);

      expect(response.body).toHaveProperty("error", "User already exists.");
    });

    test("POST /api/user/loginUser - should login successfully with correct credentials", async () => {
      // Register user first
      await request(app).post("/api/user/registerUser").send(testUser);

      // Login with correct credentials
      const response = await request(app)
        .post("/api/user/loginUser")
        .send(testUser)
        .expect(200);

      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");

      authToken = response.body.token;
    });

    test("POST /api/user/loginUser - should fail with incorrect password", async () => {
      // Register user first
      await request(app).post("/api/user/registerUser").send(testUser);

      // Login with wrong password
      const response = await request(app)
        .post("/api/user/loginUser")
        .send({ ...testUser, password: "wrongpassword" })
        .expect(401);

      expect(response.body).toHaveProperty(
        "error",
        "Invalid email or password."
      );
    });
  });

  describe("Task Management", () => {
    const testUser = {
      email: "taskuser@example.com",
      password: "testpassword123",
    };

    const testTask = {
      title: "Test Task",
      dueDate: "2024-12-31",
      completed: false,
    };

    beforeEach(async () => {
      // Register and login user before each task test
      await request(app).post("/api/user/registerUser").send(testUser);

      const loginResponse = await request(app)
        .post("/api/user/loginUser")
        .send(testUser);

      authToken = loginResponse.body.token;
    });

    test("POST /api/createTask - should create a new task successfully", async () => {
      const response = await request(app)
        .post("/api/createTask")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testTask)
        .expect(201);

      expect(response.body).toHaveProperty("title", testTask.title);
      expect(response.body).toHaveProperty("completed", false);
      expect(response.body).toHaveProperty("userId");
      expect(response.body).toHaveProperty("_id");

      taskId = response.body._id;
    });

    test("POST /api/createTask - should fail without authentication", async () => {
      const response = await request(app)
        .post("/api/createTask")
        .send(testTask)
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });

    test("GET /api/tasks - should fetch all tasks for authenticated user", async () => {
      // Create a task first
      await request(app)
        .post("/api/createTask")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testTask);

      // Fetch all tasks
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty("title", testTask.title);
    });

    test("PUT /api/task/:id - should update a task successfully", async () => {
      // Create a task first
      const createResponse = await request(app)
        .post("/api/createTask")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testTask);

      const taskId = createResponse.body._id;

      // Update the task
      const updatedData = {
        title: "Updated Task Title",
        completed: true,
      };

      const response = await request(app)
        .put(`/api/task/${taskId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedData)
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Task updated successfully"
      );
      expect(response.body.task).toHaveProperty("title", updatedData.title);
      expect(response.body.task).toHaveProperty("completed", true);
    });

    test("DELETE /api/task/:id - should delete a task successfully", async () => {
      // Create a task first
      const createResponse = await request(app)
        .post("/api/createTask")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testTask);

      const taskId = createResponse.body._id;

      // Delete the task
      const response = await request(app)
        .delete(`/api/task/${taskId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Task deleted successfully."
      );

      // Verify task is deleted
      const tasks = await Task.find({});
      expect(tasks).toHaveLength(0);
    });

    test("GET /api/task/:id - should fetch a single task by ID", async () => {
      // Create a task first
      const createResponse = await request(app)
        .post("/api/createTask")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testTask);

      const taskId = createResponse.body._id;

      // Fetch the specific task
      const response = await request(app)
        .get(`/api/task/${taskId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("_id", taskId);
      expect(response.body).toHaveProperty("title", testTask.title);
    });
  });

  describe("Error Handling", () => {
    test("should return 404 for non-existent routes", async () => {
      const response = await request(app).get("/api/nonexistent").expect(404);
    });

    test("should handle missing required fields", async () => {
      // Try to register without email
      const response = await request(app)
        .post("/api/user/registerUser")
        .send({ password: "testpassword" })
        .expect(400);

      expect(response.body).toHaveProperty(
        "error",
        "Email and password are required."
      );
    });
  });
});
