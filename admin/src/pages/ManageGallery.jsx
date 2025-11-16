import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../services/api";
import EditGallery from "../component/Gallery/EditGallery";

const ManageGallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);

  // Fetch all galleries
  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/gallery/all`);
      setGalleries(res.data);
    } catch (err) {
      console.error("Error fetching galleries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  // Delete gallery
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

  // Open Edit modal
  const openEditModal = (gallery) => {
    setSelectedGallery(gallery);
    setEditModalOpen(true);
  };

  // Close Edit modal
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedGallery(null);
  };

  return (
    <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-emerald-500 mb-6">Manage Galleries</h2>

      {loading ? (
        <p className="text-gray-500 dark:text-neutral-400">Loading galleries...</p>
      ) : galleries.length === 0 ? (
        <p className="text-gray-500 dark:text-neutral-400">No galleries found.</p>
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
              {galleries.map((gallery, index) => (
                <tr
                  key={gallery._id}
                  className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                >
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
                      className="px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(gallery._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== Edit Modal ===== */}
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
