import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PostForm from "../components/PostForm";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState({});
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`https://miniblog-mq9e.onrender.com/api/posts/${id}`)
      .then((res) => {
        setInitialData(res.data);
        setImagePreview(
          res.data.imageUrl ? `https://miniblog-mq9e.onrender.com${res.data.imageUrl}` : null
        );
      })
      .catch((err) => setError("Failed to load post"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async ({ title, content, image }) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await axios.put(`https://miniblog-mq9e.onrender.com/api/posts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to update post");
    }
  };

  const handleImageChange = (file) => {
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) return <p className="text-center mt-10">Loading post...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-6 py-10 max-w-lg ">
      <h2 className="text-2xl font-bold mb-6 text-neutral-800 hover:bg-neutral-400 tetx-neutral-800">
        Edit Post
      </h2>
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="mb-4 w-full max-h-64 object-cover rounded"
        />
      )}
      <PostForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onImageChange={handleImageChange}
      />
    </div>
  );
};

export default EditPostPage;
