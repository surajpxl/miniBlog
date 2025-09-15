import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/miniblog")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Serve uploaded images
app.use("/uploads", express.static(uploadsDir));

// Serve React frontend build static files
const frontendBuildPath = path.join(__dirname, "frontend", "build");
app.use(express.static(frontendBuildPath));

// SPA fallback: serve index.html for any non-API route
app.get("*", (req, res) => {
  // If request starts with /api or /uploads, do NOT send index.html
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
    return res.status(404).send("Not found");
  }
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
