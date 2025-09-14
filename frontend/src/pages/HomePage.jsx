import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // posts per page

  const fetchPosts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/posts?page=${pageNumber}&limit=${limit}`
      );
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handleDeletePost = (deletedId) => {
    setPosts(posts.filter((p) => p._id !== deletedId));
  };

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;
  if (!posts.length) return <p className="text-center mt-10">No posts yet!</p>;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${
              i + 1 === page ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
