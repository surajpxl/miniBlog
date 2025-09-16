import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Added this (was missing)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    setIsMenuOpen(false); // Close mobile menu on route change
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logout successful!");
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-neutral-200 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6 relative">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text"
          >
            MiniBlog
          </Link>

          {/* Center - Greeting */}
          {user && (
            <div className="absolute ml-15 left-1/2 transform -translate-x-1/2">
              <span className="text-neutral-600 dark:text-neutral-400">
                Hello, <strong>{user.name}</strong>!
              </span>
            </div>
          )}

          {/* Right - Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 font-semibold md:mr-10">
            <Link to="/" className="hover:underline hover:decoration-purple-500">
              Home
            </Link>

            {token && user ? (
              <>
                <Link to="/create" className="hover:underline hover:decoration-purple-500">
                  Create Post
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-neutral-300 dark:bg-neutral-700  hover:bg-neutral-400 dark:hover:bg-neutral-600 px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline hover:decoration-purple-500">
                  Login
                </Link>
                <Link to="/signup" className="hover:underline hover:decoration-purple-500">
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Floating Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden sticky w-1/2 ml-auto bg-neutral-100 dark:bg-neutral-800 px-6 pt-2 pb-4 space-y-2 shadow-lg rounded-bl-lg  top-16 right-0 z-40">
          <Link
            to="/"
            className="block hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          {token && user ? (
            <>
              <Link
                to="/create"
                className="block hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Post
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 px-3 py-1 rounded w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
