import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Registering  a new user
export const registerUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(409).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    // no. of times the hashing algo will run aka cost factor or slat
    // 7 - why - as because thala for a reason

    const user = new User({ email, password: hashedPassword });
    await user.save();

    response
      .status(201)
      .json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    response
      .status(500)
      .json({ error: "Registration failed", details: error.message });
    // eta 500 - internal server error
  }
};

// Login of the User
export const logInUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ error: "Email and password btho are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return response
        .status(401)
        .json({ error: "No Account with this associated Email ." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      // this user._id is the mongodb's unique id assigned automatically by mongoDb to 
      // the specific user 
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );

    response.status(200).json({ message: "Login successful", token });
  } catch (error) {
    response
      .status(500)
      .json({ error: "Login failed", details: error.message });
  }
};
