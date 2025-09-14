import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 dark:bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left: Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          MiniBlog
        </Link>

        {/* Center: Logged-in user greeting */}
        {user && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-gray-200 dark:text-gray-400">
              Hello, <strong>{user.name}</strong>!
            </span>
          </div>
        )}

        {/* Right: Navigation links */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>

          {token && user && (
            <>
              <Link to="/create" className="hover:underline">
                Create Post
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}

          {!token || !user ? (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Signup
              </Link>
            </>
          ) : null}

          {/* Dark Mode Toggle
          <button
            onClick={toggleTheme}
            className="ml-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
