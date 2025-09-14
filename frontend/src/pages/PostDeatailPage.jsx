import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/"); // go back to home
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to delete post");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!post) return <p className="text-center mt-10">Post not found!</p>;

  // Check if logged-in user is the author
  const isOwner = user?._id && post.author?._id && user._id === post.author._id;

  return (
    <div className="container mx-auto px-6 py-10 max-w-3xl">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {post.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          ✍️ Created by: {post.author?.name || "Unknown"} |{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </p>

        {post.imageUrl && (
          <img
            src={`http://localhost:5000${post.imageUrl}`}
            alt={post.title}
            className="w-full max-h-96 object-cover rounded mb-4"
          />
        )}

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          {post.content}
        </p>

        {/* Buttons */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-300 px-3 py-1 rounded hover:bg-blue-400"
          >
            ← Back
          </button>

          {isOwner && (
            <>
              <button
                onClick={() => navigate("/")}
                className=" px-4 py-2 bg-blue-300 text-white rounded hover:bg-blue-400"
              >
               Home
              </button>
              <Link
                to={`/edit/${post._id}`}
                className="px-4 py-2 ml-70 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                ✏️ Edit
              </Link>
              <button
                onClick={handleDelete}
                className=" px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                🗑️ Delete
              </button>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
