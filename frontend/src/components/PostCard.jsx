import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const PostCard = ({ post, onDelete }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const isOwner = user?._id && post.author?._id && user._id === post.author._id;

  const [localPost, setLocalPost] = useState({
    ...post,
    likes: post.likes || [],
    comments: post.comments || [],
  });

  // Only track hasLiked if user logged in (guests can't be tracked)
  const [hasLiked, setHasLiked] = useState(
    user
      ? localPost.likes.some((like) => like.user?.toString() === user._id)
      : false
  );

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`https://miniblog-mq9e.onrender.com/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onDelete) onDelete(post._id);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to delete post");
    }
  };

  const handleLike = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.put(
        `https://miniblog-mq9e.onrender.com/api/posts/${post._id}/like`,
        {},
        { headers }
      );

      // Backend returns updated likes array
      setLocalPost((prev) => ({ ...prev, likes: res.data }));

      // If user logged in, toggle hasLiked
      if (user) {
        setHasLiked((prev) => !prev);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(
        `https://miniblog-mq9e.onrender.com/api/posts/${post._id}/comment`,
        { text: commentText },
        { headers }
      );

      setLocalPost((prev) => ({ ...prev, comments: res.data }));
      setCommentText("");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded-lg p-5 mb-6 hover:shadow-lg transition">
      {localPost.imageUrl && (
        <img
          src={`https://miniblog-mq9e.onrender.com${localPost.imageUrl}`}
          alt={localPost.title}
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}
      <h3 className="text-xl font-semibold">{localPost.title}</h3>
      <p className="mt-2 text-gray-700 dark:text-gray-300">
        {localPost.excerpt || localPost.content?.slice(0, 100)}...
      </p>
      <Link
        to={`/posts/${localPost._id}`}
        className="text-blue-600 dark:text-blue-400 hover:underline mt-3 inline-block"
      >
        Read More →
      </Link>

      {/* Like & Comment Toggle */}
      <div className="flex gap-2 mt-3 flex-wrap">
        <button
          onClick={handleLike}
          className={`px-3 py-1 rounded ${
            hasLiked ? "bg-gray-300" : "bg-gray-300"
          }`}
        >
          ❤️ {localPost.likes.length}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {showComments
            ? "🙈 Hide Comments"
            : `💬 Show Comments (${localPost.comments.length})`}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4">
          <form onSubmit={handleComment} className="flex flex-col gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 w-max"
            >
              Comment
            </button>
          </form>

          {/* Show comments */}
          {localPost.comments.length > 0 && (
            <div className="mt-3 border-t pt-2 space-y-2 max-h-32 overflow-y-scroll">
              {localPost.comments.map((c, i) => (
                <div key={i} className="text-sm">
                  <strong>{c.user?.name || c.guestName || "Anonymous"}:</strong>{" "}
                  {c.text}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isOwner && (
        <div className="flex gap-2 mt-3 flex-wrap">
          <Link
            to={`/edit/${localPost._id}`}
            className="px-3 py-1 bg-green-300 text-neutral-800 rounded hover:bg-neutral-400 hover:text-white"
          >
            ✏️ Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
