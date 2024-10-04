import jwt from "jsonwebtoken";
import { createError } from "../error.js"; // Assuming you have an error handling utility

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(
      createError(401, "No token provided, you are not authenticated!")
    );
  }

  const token = authHeader.split(" ")[1]; // Extract the token after 'Bearer'
  if (!token) {
    return next(createError(401, "Token format is incorrect"));
  }

  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err) {
      console.log("Error verifying token:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded; // Attach the decoded payload to req.user
    next();
  });
};
