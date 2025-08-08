// dot env dependency
// body parser
// express
// mongoose
// nodemon - for auto reload of the server

// connection with the mongoDB database

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import taskRoute from "./routes/taskRoute.js";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import fs from "fs";

const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(cors()); // enabling the Cors for all origin

app.use("/api", taskRoute);
app.use("/api/user", userRoute);
// pore eta production e kaaj e aasbe jokhon update ba notun version banabo

// Root route aka Health Check
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 7000;
// Detect Docker by checking if /.dockerenv exists
let mongoHost = "localhost";
if (fs.existsSync("/.dockerenv")) {
  mongoHost = "mongodb"; // container name in the Docker network
}

const MONGOURL = process.env.MONGO_URL.replace("localhost", mongoHost);

// Only start server if not in test environment
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(MONGOURL)
    .then(() => {
      console.log("DB connected successfully to", MONGOURL);
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => console.log(error));
}

export default app; // <-- export the app for use in tests
