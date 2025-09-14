import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false); // 👈 NEW state

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const isOwner =
    user?._id && post?.author?._id && user._id === post?.author._id;

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

  const handleLike = async () => {
    if (!user) return alert("Login to like posts");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost({ ...post, likes: res.data.likes });
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
        `http://localhost:5000/api/posts/${id}/comment`,
        { text: commentText },
        { headers }
      );

      setPost({ ...post, comments: res.data });
      setCommentText("");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!post) return <p className="text-center mt-10">Post not found!</p>;

  const hasLiked = user && post.likes?.includes(user._id);

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

          <button
            onClick={handleLike}
            className={`px-3 py-1 rounded ${
              hasLiked ? "bg-red-500 text-white" : "bg-gray-300"
            }`}
          >
            ❤️ {post.likes?.length || 0}
          </button>

          {isOwner && (
            <>
              <Link
                to={`/edit/${post._id}`}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
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

        {/* Toggle Comments */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="mt-6 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {showComments
            ? "🙈 Hide Comments"
            : `💬 Show Comments (${post.comments?.length || 0})`}
        </button>

        {/* Comment Section */}
        {showComments && (
          <>
            {/* Comment Form */}
            <form onSubmit={handleComment} className="mt-4 flex flex-col gap-2">
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

            {/* Display Comments */}
            {post.comments?.length > 0 && (
              <div className="mt-4 border-t pt-2 space-y-2 max-h-40 overflow-y-scroll">
                {post.comments.map((c, i) => (
                  <div key={i} className="text-sm">
                    <strong>
                      {c.user?.name || c.guestName || "Anonymous"}:
                    </strong>{" "}
                    {c.text}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
