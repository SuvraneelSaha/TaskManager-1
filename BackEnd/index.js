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
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("DB connected successfully ");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
