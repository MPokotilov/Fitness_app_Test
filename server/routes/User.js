import express from "express";
import {
  UserLogin,
  UserRegister,
  addWorkout,
  getUserDashboard,
  getWorkoutsByDate,
  deleteWorkout,
  updateUserEmail,
  updateUserPassword,
  updateUserName,
} from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", UserRegister);
router.post("/signin", UserLogin);

router.get("/dashboard", verifyToken, getUserDashboard);
router.get("/workout", verifyToken, getWorkoutsByDate);
router.post("/workout", verifyToken, addWorkout);
router.delete("/workout/:workoutId", verifyToken, deleteWorkout);

// New endpoints for updating user information
router.patch("/:userId/email", verifyToken, updateUserEmail);
router.patch("/:userId/password", verifyToken, updateUserPassword);
router.patch("/:userId/name", verifyToken, updateUserName);

export default router;
