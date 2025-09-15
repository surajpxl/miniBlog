import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach token if logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Post CRUD
export const fetchPosts = () => API.get("/posts");
export const fetchPostById = (id) => API.get(`/posts/${id}`);
export const createPost = (newPost) => API.post("/posts", newPost);
export const updatePost = (id, updatedPost) => API.put(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);

// Auth APIs
export const loginUser = (credentials) => API.post("/auth/login", credentials);
export const signupUser = (userData) => API.post("/auth/signup", userData);

export default API;
