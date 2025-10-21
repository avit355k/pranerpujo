import React, { useEffect, useState } from "react";
import axios from "axios";
import EditTheme from "../component/Theme/EditTheme";

const ManageTheme = () => {
  const [themes, setThemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterArtist, setFilterArtist] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("list"); // list or edit
  const [themeIdToEdit, setThemeIdToEdit] = useState(null);

  const API_BASE = "http://localhost:5000/api/theme";

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
      console.error("Error fetching themes:", err);
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
    } catch (err) {
      console.error("Error searching themes:", err);
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
      const queryParams = [];
      if (filterYear) queryParams.push(`year=${filterYear}`);
      if (filterArtist) queryParams.push(`artist=${filterArtist}`);

      const res = await axios.get(`${API_BASE}/filter?${queryParams.join("&")}`);
      setThemes(res.data);
      setError("");
    } catch (err) {
      console.error("Error filtering themes:", err);
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
    } catch (err) {
      console.error("Error deleting theme:", err);
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
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-emerald-500">
        Manage Themes
      </h2>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or concept..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-600 rounded-md w-64 bg-gray-800 text-gray-100 placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>

        <input
          type="number"
          placeholder="Filter by Year"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="p-2 border border-gray-600 rounded-md w-40 bg-gray-800 text-gray-100 placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Filter by Artist ID"
          value={filterArtist}
          onChange={(e) => setFilterArtist(e.target.value)}
          className="p-2 border border-gray-600 rounded-md w-56 bg-gray-800 text-gray-100 placeholder-gray-400"
        />
        <button
          onClick={handleFilter}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Apply Filter
        </button>
        <button
          onClick={() => {
            setSearchQuery("");
            setFilterYear("");
            setFilterArtist("");
            fetchAllThemes();
          }}
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-400">Loading themes...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-gray-800 shadow-md rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-700 text-left text-gray-100">
                <th className="p-3 border border-gray-600">#</th>
                <th className="p-3 border border-gray-600">Theme ID</th>
                <th className="p-3 border border-gray-600">Name</th>
                <th className="p-3 border border-gray-600">Year</th>
                <th className="p-3 border border-gray-600">Pandel</th>
                <th className="p-3 border border-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {themes.map((theme, index) => (
                <tr
                  key={theme._id}
                  className={`hover:bg-gray-700 ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}`}
                >
                  <td className="p-3 border border-gray-600">{index + 1}</td>
                  <td className="p-3 border border-gray-600 font-mono text-gray-300">
                    {theme._id}
                  </td>
                  <td className="p-3 border border-gray-600 font-semibold text-gray-100">
                    {theme.title}
                  </td>
                  <td className="p-3 border border-gray-600">{theme.year}</td>
                  <td className="p-3 border border-gray-600">{theme.pandel?.name || "N/A"}</td>
                  <td className="p-3 border border-gray-600 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(theme._id)}
                      className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(theme._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {themes.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-400 py-4 border border-gray-600">
                    No themes available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageTheme;
