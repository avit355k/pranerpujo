import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdTempleBuddhist, MdEditDocument } from "react-icons/md";
import { IoIosArrowForward, IoMdPersonAdd, IoMdCloudUpload } from "react-icons/io";
import { GrUserWorker } from "react-icons/gr";
import { TbBrandAppgallery } from "react-icons/tb";
import { FaPalette } from "react-icons/fa6";

const Sidebar = () => {
  const [isArtistOpen, setIsArtistOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <div className="w-64 bg-white text-black dark:bg-neutral-900 dark:text-white shadow-lg p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-8 text-emerald-500">
          Praner Pujo Admin
        </h2>

        <nav className="space-y-4">
          {/* Dashboard */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg transition ${
                isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <MdDashboard size={22} /> Dashboard
          </NavLink>

          {/* Add Pandals */}
          <NavLink
            to="/addpandals"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg transition ${
                isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <MdTempleBuddhist size={22} /> Add Pandals
          </NavLink>

          {/* Manage Pandals */}
          <NavLink
            to="/managepandals"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg transition ${
                isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <MdEditDocument size={22} /> Manage Pandals
          </NavLink>

          {/* Artists Section */}
          <button
            onClick={() => setIsArtistOpen(!isArtistOpen)}
            className={`flex items-center justify-between w-full p-2 rounded-lg transition ${
              isArtistOpen
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <GrUserWorker size={20} /> Artists
            </div>
            <IoIosArrowForward
              size={20}
              className={`transition-transform duration-300 ${
                isArtistOpen ? "rotate-90" : ""
              }`}
            />
          </button>

          {isArtistOpen && (
            <div className="ml-8 mt-2 space-y-2">
              <NavLink
                to="/artists/add"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <IoMdPersonAdd /> Add Artist
              </NavLink>
              <NavLink
                to="/artists/manage"
                className={({ isActive }) =>
                  `block p-2 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                🧾 Manage Artists
              </NavLink>
            </div>
          )}

          {/* Theme Section */}
          <button
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className={`flex items-center justify-between w-full p-2 rounded-lg transition ${
              isThemeOpen
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaPalette size={20} /> Theme
            </div>
            <IoIosArrowForward
              size={20}
              className={`transition-transform duration-300 ${
                isThemeOpen ? "rotate-90" : ""
              }`}
            />
          </button>

          {isThemeOpen && (
            <div className="ml-8 mt-2 space-y-2">
              <NavLink
                to="/themes/add"
                className={({ isActive }) =>
                  `block p-2 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                ➕ Add Theme
              </NavLink>
              <NavLink
                to="/themes/manage"
                className={({ isActive }) =>
                  `block p-2 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                🧾 Manage Theme
              </NavLink>
            </div>
          )}

          {/* Gallery Section */}
          <button
            onClick={() => setIsGalleryOpen(!isGalleryOpen)}
            className={`flex items-center justify-between w-full p-2 rounded-lg transition ${
              isGalleryOpen
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <TbBrandAppgallery size={20} /> Gallery
            </div>
            <IoIosArrowForward
              size={20}
              className={`transition-transform duration-300 ${
                isGalleryOpen ? "rotate-90" : ""
              }`}
            />
          </button>

          {isGalleryOpen && (
            <div className="ml-8 mt-2 space-y-2">
              <NavLink
                to="/gallery/upload"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <IoMdCloudUpload /> Upload Album
              </NavLink>
              <NavLink
                to="/gallery/manage"
                className={({ isActive }) =>
                  `block p-2 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                🧾 Manage Gallery
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-5">
        © 2025 Admin Panel
      </p>
    </div>
  );
};

export default Sidebar;
