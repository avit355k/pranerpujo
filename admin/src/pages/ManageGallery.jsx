import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { API } from "../services/api";
import EditGallery from "../component/Gallery/EditGallery";

// ==========================
// MEMOIZED ROW COMPONENT
// ==========================
const GalleryRow = React.memo(({ gallery, index, openEditModal, handleDelete }) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
      <td className="border p-3 dark:border-neutral-700 text-center">
        {index + 1}
      </td>

      <td className="border p-3 dark:border-neutral-700 text-center">
        {gallery.pandel?.name || "—"}
      </td>

      <td className="border p-3 dark:border-neutral-700 text-center">
        {gallery.year}
      </td>

      <td className="border p-3 dark:border-neutral-700 text-center">
        {gallery.video ? (
          <a
            href={gallery.video}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-500 underline"
          >
            View
          </a>
        ) : (
          <span className="text-gray-400">No video</span>
        )}
      </td>

      <td className="border p-3 dark:border-neutral-700">
        <div className="flex flex-wrap gap-2 justify-center">
          {gallery.photos.slice(0, 3).map((photo, idx) => (
            <img
              key={idx}
              src={photo}
              loading="lazy"
              alt="thumb"
              className="w-12 h-12 object-cover rounded"
            />
          ))}

          {gallery.photos.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-neutral-400">
              +{gallery.photos.length - 3} more
            </span>
          )}
        </div>
      </td>

      <td className="border p-3 dark:border-neutral-700 text-center space-x-2">
        <button
          onClick={() => openEditModal(gallery)}
          className="px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
        >
          Edit
        </button>

        <button
          onClick={() => handleDelete(gallery._id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );
});

const ManageGallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // ==========================
  // Fetch Galleries
  // ==========================
  const fetchGalleries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/gallery/all`);
      setGalleries(res.data);
    } catch (err) {
      console.error("Error fetching galleries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  // ==========================
  // DELETE GALLERY
  // ==========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery?")) return;

    try {
      await axios.delete(`${API}/api/gallery/${id}`);
      setGalleries((prev) => prev.filter((g) => g._id !== id));
      alert("Gallery deleted successfully!");
    } catch (err) {
      console.error("Error deleting gallery:", err);
      alert("Failed to delete gallery.");
    }
  };

  // ==========================
  // FILTERED LIST
  // ==========================
  const filteredGalleries = useMemo(() => {
    return galleries.filter((g) => {
      const matchesSearch = g.pandel?.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesYear = yearFilter ? g.year === Number(yearFilter) : true;

      return matchesSearch && matchesYear;
    });
  }, [galleries, search, yearFilter]);

  // ==========================
  // Modal Handling
  // ==========================
  const openEditModal = (gallery) => {
    setSelectedGallery(gallery);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedGallery(null);
  };

  // Extract unique years for dropdown
  const years = [...new Set(galleries.map((g) => g.year))].sort((a, b) => b - a);

  return (
    <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-md transition-none">
      <h2 className="text-2xl font-semibold text-emerald-500 mb-6">
        Manage Galleries
      </h2>

      {/* ==========================
          SEARCH + FILTER UI
      =========================== */}
      <div className="flex flex-col md:flex-row gap-4 mb-5">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search Pandel Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-md w-full md:w-1/2"
        />

        {/* Year Filter */}
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-4 py-2 border dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-md w-full md:w-1/4"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-neutral-400">Loading galleries...</p>
      ) : filteredGalleries.length === 0 ? (
        <p className="text-gray-500 dark:text-neutral-400">
          No gallery found for this search or filter.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-neutral-700 text-sm">
            <thead className="bg-gray-100 dark:bg-neutral-800">
              <tr>
                <th className="border p-3 dark:border-neutral-700">#</th>
                <th className="border p-3 dark:border-neutral-700">Pandel</th>
                <th className="border p-3 dark:border-neutral-700">Year</th>
                <th className="border p-3 dark:border-neutral-700">Video</th>
                <th className="border p-3 dark:border-neutral-700">Photos</th>
                <th className="border p-3 dark:border-neutral-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredGalleries.map((gallery, index) => (
                <GalleryRow
                  key={gallery._id}
                  gallery={gallery}
                  index={index}
                  openEditModal={openEditModal}
                  handleDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalOpen && selectedGallery && (
        <EditGallery
          gallery={selectedGallery}
          onClose={closeEditModal}
          refreshGalleries={fetchGalleries}
        />
      )}
    </div>
  );
};

export default ManageGallery;
