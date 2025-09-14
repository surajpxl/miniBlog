import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = (deletedId) => {
    setPosts(posts.filter((p) => p._id !== deletedId));
  };

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;
  if (!posts.length) return <p className="text-center mt-10">No posts yet!</p>;

  return (
    <div className="container mx-auto px-6 py-10 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
      ))}
    </div>
  );
};

export default HomePage;
