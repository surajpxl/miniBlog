import express from "express";
import Post from "../models/Post.js";
import { auth } from "../middleware/auth.js";
import { authOptional } from "../middleware/authOptional.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Initialize upload
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

// Get All Posts with pagination
// GET /api/posts?page=1&limit=5
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "_id name");

    res.json({
      posts,
      page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
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


// PUT /api/posts/:id/like
// PUT /api/posts/:id/like
router.put("/:id/like", authOptional, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (req.userId) {
      // Logged-in user like
      const alreadyLiked = post.likes.some(
        (like) => like.user?.toString() === req.userId
      );

      if (!alreadyLiked) {
        post.likes.push({ user: req.userId });
      }
    } else {
      // Guest like
      const guestName = `Guest${Math.floor(Math.random() * 1000)}`;

      // You could also prevent the same guest from liking again in a session using cookies or IP, but
      // if not tracked, every request counts as a new guest like.

      post.likes.push({ guestName });
    }

    await post.save();
    await post.populate("likes.user", "_id name");

    res.json(post.likes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Comment on a post
router.post("/:id/comment", authOptional, async (req, res) => {
  try {
    const { text, guestName } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text is required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    let comment;
    if (req.userId) {
      // Logged-in user
      comment = { user: req.userId, text };
    } else {
      // Guest user
      const randomGuest = guestName || `Guest${Math.floor(Math.random() * 1000)}`;
      comment = { user: null, text, guestName: randomGuest };
    }

    post.comments.push(comment);
    await post.save();
    await post.populate("comments.user", "_id name");

    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





export default router;
