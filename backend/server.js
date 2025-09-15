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

const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// ✅ Serve index.html for unknown routes (for SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000

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
app.listen(PORT, () => console.log("Server running on port 5000"));
