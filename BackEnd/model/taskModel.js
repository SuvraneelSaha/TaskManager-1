// this is for managing the structure of the data and interaction of the DB

import mongoose from "mongoose";

// schema for taskModel

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
    default: null
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Refers to the User model
    required: true
  }
});

export default mongoose.model("Task", taskSchema);