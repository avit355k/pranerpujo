import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconButton, Avatar, Menu, MenuItem, Divider } from "@mui/material";
import { FiSearch, FiBell, FiUser } from "react-icons/fi";
import { LightMode, DarkMode } from "@mui/icons-material";
import logo from "../../assets/logo/pplogo.png";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-emerald-100 via-green-100 to-emerald-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 border-b border-gray-300 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo */}
          <h1 className="text-xl font-semibold">Welcome! 👋</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-3 py-2 border rounded-full text-sm bg-gray-50 dark:bg-gray-800 dark:text-gray-200 focus:outline-none"
            />
            <FiSearch className="absolute left-2 top-2.5 text-gray-500" />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3 gap-4">
            {/* Dark Mode Toggle */}
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <LightMode className="text-yellow-400" />
              ) : (
                <DarkMode className="text-gray-700 dark:text-gray-300" />
              )}
            </IconButton>

            {/* Profile Avatar */}
            <div>
              <Avatar
                onClick={handleProfileClick}
                sx={{ cursor: "pointer" }}
                alt="Admin Profile"
                src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png"
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <div className="px-3 py-2">
                  <p className="font-medium text-gray-800">Darina</p>
                  <p className="text-xs text-gray-500">UI/UX Designer</p>
                </div>
                <Divider />
                <MenuItem onClick={handleClose}>
                  <Link to="/profile" className="w-full text-gray-700 dark:text-gray-200">
                    Profile
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link to="/settings" className="w-full text-gray-700 dark:text-gray-200">
                    Settings
                  </Link>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => alert("Logging out...")}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
