import express from "express";
import Post from "../models/Post.js";
import { auth } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

// Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


// Create Post with optional image
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file ? "/uploads/" + req.file.filename : undefined;

    const post = await Post.create({ title, content, imageUrl, author: req.userId });
    await post.populate("author", "_id name");
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Posts
router.get("/", async (req, res) => {
  const posts = await Post.find().populate("author", "_id name");
  res.json(posts);
});

// Get Single Post
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "_id name");
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

// Update Post with optional image
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.author.toString() !== req.userId) return res.status(403).json({ error: "Not allowed" });

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    if (req.file) post.imageUrl = "/uploads/" + req.file.filename;

    await post.save();
    await post.populate("author", "_id name");
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Post
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.author.toString() !== req.userId)
      return res.status(403).json({ error: "Not allowed" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
