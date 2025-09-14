import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PostForm from "../components/PostForm";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async ({ title, content, image }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to create a post");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <PostForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreatePostPage;
