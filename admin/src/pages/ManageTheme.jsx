import React, { useEffect, useState } from "react";
import axios from "axios";
import EditTheme from "../component/Theme/EditTheme";
import { API } from "../../services/api";

const ManageTheme = () => {
  const [themes, setThemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterArtist, setFilterArtist] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [themeIdToEdit, setThemeIdToEdit] = useState(null);

  const API_BASE = `${API}/api/theme`;

  useEffect(() => {
    fetchAllThemes();
  }, []);

  const fetchAllThemes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/all`);
      setThemes(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load themes");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return fetchAllThemes();
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/search?q=${searchQuery}`);
      setThemes(res.data);
      setError("");
    } catch {
      setError("No themes found for the search query");
      setThemes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    if (!filterYear && !filterArtist) return fetchAllThemes();
    try {
      setLoading(true);
      const params = [];
      if (filterYear) params.push(`year=${filterYear}`);
      if (filterArtist) params.push(`artist=${filterArtist}`);
      const res = await axios.get(`${API_BASE}/filter?${params.join("&")}`);
      setThemes(res.data);
      setError("");
    } catch {
      setError("No themes found for given filters");
      setThemes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this theme?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setThemes((prev) => prev.filter((t) => t._id !== id));
      alert("Theme deleted successfully!");
    } catch {
      alert("Failed to delete theme.");
    }
  };

  const handleEdit = (id) => {
    setThemeIdToEdit(id);
    setActiveTab("edit");
  };

  const handleBackToList = () => {
    setActiveTab("list");
    setThemeIdToEdit(null);
  };

  if (activeTab === "edit" && themeIdToEdit) {
    return <EditTheme themeIdToEdit={themeIdToEdit} onBack={handleBackToList} />;
  }

  return (
    <div className="">
      <h2 className="text-3xl font-bold mb-8 text-center text-emerald-500">🎨 Manage Themes</h2>

      {/* Search & Filter Section */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by title or concept..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-400 dark:border-gray-700 rounded-md w-60 
          bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md cursor-pointer"
        >
          Search
        </button>

        <input
          type="number"
          placeholder="Filter by Year"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="p-2 border border-gray-400 dark:border-gray-700 rounded-md w-40 
          bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-500"
        />
        <input
          type="text"
          placeholder="Filter by Artist ID"
          value={filterArtist}
          onChange={(e) => setFilterArtist(e.target.value)}
          className="p-2 border border-gray-400 dark:border-gray-700 rounded-md w-56 
          bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-500"
        />
        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md cursor-pointer"
        >
          Apply
        </button>
        <button
          onClick={() => {
            setSearchQuery("");
            setFilterYear("");
            setFilterArtist("");
            fetchAllThemes();
          }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-emerald-700 text-white">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Theme ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Year</th>
              <th className="py-3 px-4">Pandel</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Loading themes...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-red-500">{error}</td>
              </tr>
            ) : themes.length > 0 ? (
              themes.map((theme, index) => (
                <tr
                  key={theme._id}
                  className="border-b border-gray-300 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-neutral-900 transition"
                >
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-200">{index + 1}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-200">{theme._id}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-200">{theme.title}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-200">{theme.year}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-200">
                    {theme.pandel?.name || "N/A"}
                  </td>
                  <td className="py-3 px-4 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(theme._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded-md font-semibold cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(theme._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 dark:text-gray-400 py-6">
                  No themes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTheme;
