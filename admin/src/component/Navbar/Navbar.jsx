import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ useNavigate is imported
import { FiSearch } from "react-icons/fi";
import { LightMode, DarkMode } from "@mui/icons-material";
import axios from "axios";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // ✅ define navigate

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  //  Fetch admin name using token
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdminName(res.data.name); // ✅ store name from backend
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        // optional: handle token expiry
        if (error.response?.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    setDropdownOpen(false);
    navigate("/admin/login"); // ✅ now works
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-emerald-100 via-green-100 to-emerald-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 border-b border-gray-300 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo */}
          <h1 className="text-xl font-semibold font-serif">Welcome</h1>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-3 py-2 border rounded-full text-sm bg-emerald-50 dark:bg-neutral-800 dark:text-gray-200 focus:outline-none"
            />
            <FiSearch className="absolute left-2 top-2.5 text-gray-500" />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3 gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
              className="p-2 rounded-full hover:bg-emerald-200 dark:hover:bg-neutral-700 cursor-pointer"
            >
              {darkMode ? (
                <LightMode className="text-yellow-400" />
              ) : (
                <DarkMode className="text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Profile Avatar - Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {/* Profile Initial Circle */}
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 flex items-center justify-center bg-emerald-500 dark:bg-neutral-700 text-white text-lg font-semibold rounded-full cursor-pointer border-2 border-emerald-200 dark:border-neutral-600 select-none"
              >
                {adminName ? adminName.charAt(0).toUpperCase() : "A"}
              </div>


              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 shadow-lg rounded-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-neutral-700">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {adminName || "Loading..."}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                  >
                    Profile
                  </Link>

                  <Link
                    to=""
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                  >
                    Settings
                  </Link>

                  <div className="border-t border-gray-200 dark:border-neutral-700" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
