import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const PostCard = ({ post, onDelete }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isOwner = user?._id && post.author?._id && user._id === post.author._id;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onDelete) onDelete(post._id);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to delete post");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded-lg p-5 mb-6 hover:shadow-lg transition">
      {post.imageUrl && (
        <img
          src={`http://localhost:5000${post.imageUrl}`}
          alt={post.title}
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}
      <h3 className="text-xl font-semibold">{post.title}</h3>
      <p className="mt-2 text-gray-700 dark:text-gray-300">
        {post.excerpt || post.content?.slice(0, 100)}...
      </p>
      <Link
        to={`/posts/${post._id}`}
        className="text-blue-600 dark:text-blue-400 hover:underline mt-3 inline-block"
      >
        Read More →
      </Link>

      {isOwner && (
        <div className="flex gap-2 mt-3 flex-wrap">
          <Link
            to={`/edit/${post._id}`}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            ✏️ Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
