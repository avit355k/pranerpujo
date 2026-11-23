import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdTempleBuddhist, MdEditDocument, MdManageAccounts } from "react-icons/md";
import { IoIosArrowForward, IoMdPersonAdd, IoMdCloudUpload, IoMdAddCircle } from "react-icons/io";
import { GrUserWorker } from "react-icons/gr";
import { TbBrandAppgallery, TbEdit, TbPhotoEdit, TbRoute } from "react-icons/tb";
import { FaPalette } from "react-icons/fa6";
import { SiCssdesignawards } from "react-icons/si";

const Sidebar = () => {
  const [isArtistOpen, setIsArtistOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAwardsopen, setIsAwardsOpen] = useState(false);
  const [isrouteGuideopen, setIsRouteGuideOpen] = useState(false);

  return (
    <div className="w-64 h-screen sticky top-0 bg-white text-black dark:bg-neutral-900 dark:text-white shadow-lg p-5 flex flex-col">
      {/* Fixed header */}
      <h2 className="text-2xl font-bold mb-6 text-emerald-500 shrink-0">
        Praner Pujo Admin
      </h2>

      {/* Scrollable nav */}
      <nav className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 [scrollbar-width:thin]">
        {/* Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg transition ${isActive
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
            `flex items-center gap-3 p-2 rounded-lg transition ${isActive
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
            `flex items-center gap-3 p-2 rounded-lg transition ${isActive
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
          className={`flex items-center justify-between w-full p-2 rounded-lg transition cursor-pointer ${isArtistOpen
            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
        >
          <div className="flex items-center gap-3">
            <GrUserWorker size={20} /> Artists
          </div>
          <IoIosArrowForward
            size={20}
            className={`transition-transform duration-300 ${isArtistOpen ? "rotate-90" : ""}`}
          />
        </button>

        {isArtistOpen && (
          <div className="ml-8 mt-2 space-y-2">
            <NavLink
              to="/artists/add"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition cursor-pointer ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <IoMdPersonAdd size={18} /> Add Artist
            </NavLink>
            <NavLink
              to="/artists/manage"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition cursor-pointer ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <MdManageAccounts size={18} /> Manage Artists
            </NavLink>
          </div>
        )}

        {/* Theme Section */}
        <button
          onClick={() => setIsThemeOpen(!isThemeOpen)}
          className={`flex items-center justify-between w-full p-2 rounded-lg transition cursor-pointer ${isThemeOpen
            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
        >
          <div className="flex items-center gap-3">
            <FaPalette size={20} /> Theme
          </div>
          <IoIosArrowForward
            size={20}
            className={`transition-transform duration-300 ${isThemeOpen ? "rotate-90" : ""}`}
          />
        </button>

        {isThemeOpen && (
          <div className="ml-8 mt-2 space-y-2">
            <NavLink
              to="/themes/add"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition cursor-pointer ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <IoMdAddCircle size={18} /> Add Theme
            </NavLink>
            <NavLink
              to="/themes/manage"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition cursor-pointer ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <TbEdit size={18} /> Manage Theme
            </NavLink>
          </div>
        )}

        {/* Gallery Section */}
        <button
          onClick={() => setIsGalleryOpen(!isGalleryOpen)}
          className={`flex items-center justify-between w-full p-2 rounded-lg transition cursor-pointer ${isGalleryOpen
            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
        >
          <div className="flex items-center gap-3">
            <TbBrandAppgallery size={20} /> Gallery
          </div>
          <IoIosArrowForward
            size={20}
            className={`transition-transform duration-300 ${isGalleryOpen ? "rotate-90" : ""}`}
          />
        </button>

        {isGalleryOpen && (
          <div className="ml-8 mt-2 space-y-2">
            <NavLink
              to="/gallery/upload"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition ${isActive
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
                `flex items-center gap-3 p-2 rounded-lg text-sm transition cursor-pointer ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <TbPhotoEdit size={18} /> Manage Gallery
            </NavLink>
          </div>
        )}

        {/* Awards Section */}
        <button
          onClick={() => setIsAwardsOpen(!isAwardsopen)}
          className={`flex items-center justify-between w-full p-2 rounded-lg transition cursor-pointer ${isAwardsopen
            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
        >
          <div className="flex items-center gap-3">
            <SiCssdesignawards size={20} /> Awards
          </div>
          <IoIosArrowForward
            size={20}
            className={`transition-transform duration-300 ${isAwardsopen ? "rotate-90" : ""}`}
          />
        </button>

        {isAwardsopen && (
          <div className="ml-8 mt-2 space-y-2">
            <NavLink
              to="/awards/add"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <IoMdAddCircle /> Add Awards
            </NavLink>
            <NavLink
              to="/awards/manage"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition cursor-pointer ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <TbEdit size={18} /> Manage Awards
            </NavLink>
          </div>
        )}

        {/* Route Guide Section */}
        <button
          onClick={() => setIsRouteGuideOpen(!isrouteGuideopen)}
          className={`flex items-center justify-between w-full p-2 rounded-lg transition cursor-pointer ${isrouteGuideopen
            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
        >
          <div className="flex items-center gap-3">
            <TbRoute size={20} /> Route Guide
          </div>
          <IoIosArrowForward
            size={20}
            className={`transition-transform duration-300 ${isrouteGuideopen ? "rotate-90" : ""}`}
          />
        </button>

        {isrouteGuideopen && (
          <div className="ml-8 mt-2 space-y-2">
            <NavLink
              to="/route-guide/transist-mode/add"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <IoMdAddCircle /> Add Transist Mode
            </NavLink>
            <NavLink
              to="/route-guide/transist-mode/manage"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition cursor-pointer ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <TbEdit size={18} /> Manage Transist Mode
            </NavLink>

            <NavLink
              to="/route-guide/transist-line/add"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <IoMdAddCircle /> Add Transist Line
            </NavLink>

            <NavLink
              to="/route-guide/transist-line/manage"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition cursor-pointer ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <TbEdit size={18} /> Manage Transist Line
            </NavLink>

             <NavLink
              to="/route-guide/station/add"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <IoMdAddCircle /> Add Station
            </NavLink>

            <NavLink
              to="/route-guide/station/manage"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition cursor-pointer ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <TbEdit size={18} /> Manage Station
            </NavLink>

                <NavLink
              to="/route-guide/station-pandels/add"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <IoMdAddCircle /> Add Station Pandels
            </NavLink>

            <NavLink
              to="/route-guide/station-pandels/manage"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg text-sm transition cursor-pointer ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <TbEdit size={18} /> Manage Stations Pandels
            </NavLink>
          </div>
        )}
      </nav>

      {/* Fixed footer */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4 shrink-0">
        © 2025 Admin Panel
      </p>
    </div>
  );
};

export default Sidebar;