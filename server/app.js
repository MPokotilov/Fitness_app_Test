// app.js
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/user/", UserRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err); // Log detailed error information
  res.status(err.status || 500).json({
    success: false,
    status: err.status || 500,
    message: err.message || "Internal Server Error",
  });
});

app.get("/", async (req, res) => {
  res.status(200).json({});
});

// Connect to MongoDB when not in test mode
if (process.env.NODE_ENV !== "test") {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Failed to connect with MongoDB");
      console.error(err);
    });
}

export default app;
