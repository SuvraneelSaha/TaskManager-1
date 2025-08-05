import User from "../model/userModel.js";

// Register a new user
export const registerUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    // Basic validation
    if (!email || !password) {
      return response.status(400).json({ error: "Email and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(409).json({ error: "User already exists." });
    }

    const user = new User({ email, password }); // 🔐 You’ll hash this later
    await user.save();

    response.status(201).json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    response.status(500).json({ error: "Registration failed", details: error.message });
  }
};