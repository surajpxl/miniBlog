
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    guestName: { type: String }, 
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const likeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    guestName: { type: String }, 
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },

  // updated likes: now supports both user + guest
  likes: [likeSchema],

  // updated comments: already supports both user + guest
  comments: [commentSchema],
});

const Post = mongoose.model("Post", postSchema);
export default Post;
