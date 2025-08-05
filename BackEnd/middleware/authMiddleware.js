import jwt from "jsonwebtoken";

const authMiddleware = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({ error: "Authorization token missing or not Valid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded; // Attaching the  decoded user info to request
    next();
  } catch (error) {
    return response.status(401).json({ error: "Invalid or token expired " });
  }
};

export default authMiddleware;