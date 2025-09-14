import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/miniblog")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Serve uploaded images
app.use("/uploads", express.static(uploadsDir));

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
