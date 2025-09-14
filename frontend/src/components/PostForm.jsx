import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PostForm = ({ onSubmit, initialData = {}, onImageChange }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, image });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (onImageChange) onImageChange(file);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border dark:border-gray-600 rounded-lg p-3 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border dark:border-gray-600 rounded-lg p-3 mb-4 h-40 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Save Post
        </button>
      </form>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-300 px-3 ml-10 py-1 mt-2 rounded hover:bg-blue-400"
      >
        ← Back
      </button>
    </>
  );
};

export default PostForm;
