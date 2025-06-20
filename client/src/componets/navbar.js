import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = ({ dark, setDark, selectedCategory, setSelectedCategory }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef();

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/login");
      window.location.reload();
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Fetch cart count from backend
    const fetchCartCount = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        setCartCount(res.data.cart?.items?.length || 0);
      } catch (e) {
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, []);

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home",
    "Beauty",
    "Sports",
    "Toys",
    "Grocery",
    "Other",
  ];

  return (
    <nav className="relative bg-white shadow dark:bg-gray-800">
      <div className="container h-16 px-4 py-2 mx-auto md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          <a href="/">
            <svg
              className="w-auto h-14 sm:h-16"
              viewBox="0 0 300 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#6366F1" /> {/* Indigo-500 */}
                  <stop offset="100%" stopColor="#3B82F6" /> {/* Blue-500 */}
                </linearGradient>
              </defs>

              {/* Circle Icon */}
              <circle cx="50" cy="50" r="40" fill="url(#logoGradient)" />

              {/* Shopping Bag Icon inside circle */}
              <path
                d="M43 35 h14 a2 2 0 0 1 2 2 v26 a2 2 0 0 1 -2 2 h-14 a2 2 0 0 1 -2 -2 v-26 a2 2 0 0 1 2 -2 z"
                fill="white"
              />
              <path
                d="M48 38 v5 a7 7 0 0 0 14 0 v-5"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                fill="none"
              />

              {/* Brand Name */}
              <text
                x="110"
                y="60"
                textAnchor="start"
                fontSize="32"
                fontWeight="700"
                fontFamily="'Segoe UI', Arial, sans-serif"
                fill="url(#logoGradient)"
              >
                ShopNexa
              </text>
            </svg>
          </a>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none mt-2"
              aria-label="toggle menu"
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu items */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } absolute inset-x-0 z-20 w-full px-6 py-2 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center`}
        >
          <div className="flex flex-col md:flex-row md:mx-6">
            <a
              className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
              href="/"
            >
              Home
            </a>
            <a
              className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
              href="/"
            >
              Shop
            </a>

            <a
              className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
              href="/about"
            >
              About
            </a>
            {!isLoggedIn ? (
              <>
                <Link
                  className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                  to="/signup"
                >
                  Signup
                </Link>
                <Link
                  className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                  to="/login"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <button
                  className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <div className="flex justify-center md:block">
            <Link
              className="relative text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-300"
              to="/cart"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs text-white bg-blue-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
