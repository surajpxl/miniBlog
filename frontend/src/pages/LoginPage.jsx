import React, { useState} from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

   

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // <-- important
      // save JWT
      navigate("/"); // redirect to home
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error("Login failed: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-md ">
      <h1 className="font-bold text-2xl">Login</h1>
      <form
        onSubmit={handleLogin} // or handleSignup
        className="max-w-md mx-auto bg-gradient-to-br from-neutral-10 via-neutral-50 to-neutral-200
 shadow-lg rounded-lg p-6 space-y-4"
      >
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300"
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300"
          required
        />
        <button
          type="submit"
          className="w-full bg-neutral-300 text-neutral-800 px-6 py-2 rounded-lg hover:bg-neutral-400 font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
