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
const PORT = process.env.PORT || 5000

// Ensure uploads folder exists
const uploadsDir = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect MongoDB

const mongo_URI = "mongodb+srv://guptasuraj4455_db_user:2Vx9IC9D8A1BgI5G@blogapp.lcqrn2q.mongodb.net/"
mongoose.connect(mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Serve uploaded images
app.use("/uploads", express.static(uploadsDir));

// Start server
app.listen(PORT, () => console.log("Server running on port 5000"));
