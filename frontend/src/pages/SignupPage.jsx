import React, { useState } from "react";
import { signupUser } from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signupUser({ name, email, password });
      localStorage.setItem("token", data.token); // save JWT
      navigate("/");
      toast.success("Account created!, please login..");

    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      toast.error("Signup failed: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-md ">
      <h1 className="font-bold text-2xl">Signup</h1>
      <form
        onSubmit={handleSignup}
        className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4"
      >
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          required
        />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          required
        />
        <button
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          type="submit"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
