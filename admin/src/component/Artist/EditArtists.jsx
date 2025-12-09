import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../services/api";

const EditArtists = ({ artistIdToEdit, onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    image: "",
  });

  const [artistWorks, setArtistWorks] = useState([]);
  const [editWorkData, setEditWorkData] = useState(null);

  const [pandels, setPandels] = useState([]);
  const [themes, setThemes] = useState([]);

  const [loading, setLoading] = useState(true);

  // Fetch Pandel & Theme List
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [pandelRes, themeRes] = await Promise.all([
          axios.get(`${API}/api/pandel/all`),
          axios.get(`${API}/api/theme/all`),
        ]);
        setPandels(pandelRes.data || []);
        setThemes(themeRes.data || []);
      } catch (error) {
        console.error("Dropdown fetch error:", error);
      }
    };
    fetchDropdownData();
  }, []);

  // Fetch Artist Full Data
  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        const res = await axios.get(`${API}/api/artist/${artistIdToEdit}`);
        if (res.data) {
          setFormData({
            name: res.data.name || "",
            role: res.data.role || "",
            bio: res.data.bio || "",
            image: res.data.image || "",
          });
          setArtistWorks(res.data.works || []);
        }
      } catch (err) {
        console.error("Error fetching artist details:", err);
        alert(" Failed to load artist details.");
      } finally {
        setLoading(false);
      }
    };
    if (artistIdToEdit) fetchArtistDetails();
  }, [artistIdToEdit]);

  // Artist Field Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save Artist
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API}/api/artist/${artistIdToEdit}`, formData);
      if (res.status === 200) {
        alert(" Artist updated successfully!");
        onBack();
      } else {
        alert(" Unexpected response.");
      }
    } catch (err) {
      console.error("Artist update error:", err);
      alert(" Error updating artist.");
    }
  };

  // Open Work Edit Popup
  const startEditingWork = (work) => {
    setEditWorkData({ ...work });
  };

  // Save Work
  const updateWork = async () => {
    if (!editWorkData.year || !editWorkData.pandel || !editWorkData.theme) {
      alert("⚠️ Please fill Year, Pandel, and Theme!");
      return;
    }
    try {
      await axios.put(`${API}/api/artist/${artistIdToEdit}/work/${editWorkData._id}`, {
        year: editWorkData.year,
        pandel: editWorkData.pandel._id,
        theme: editWorkData.theme._id,
        description: editWorkData.description,
      });

      alert(" Work updated!");
      setEditWorkData(null);

      // Refresh the works list
      const res = await axios.get(`${API}/api/artist/${artistIdToEdit}`);
      setArtistWorks(res.data.works || []);
    } catch (err) {
      console.error("Work update error:", err);
      alert(" Failed to update work.");
    }
  };

  // Delete Work
  const deleteWork = async (workId) => {
    if (!window.confirm("Delete this work?")) return;
    try {
      await axios.delete(`${API}/api/artist/${artistIdToEdit}/work/${workId}`);
      alert(" Work deleted!");
      // Refresh works
      const res = await axios.get(`${API}/api/artist/${artistIdToEdit}`);
      setArtistWorks(res.data.works || []);
    } catch (err) {
      console.error("Delete error:", err);
      alert(" Failed to delete work.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-neutral-500">
        Loading artist details...
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-500">
        Edit Artist Details
      </h2>

      {/* ARTIST UPDATE FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Artist Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded-lg"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded-lg"
        >
          <option value="">Select Role</option>
          <option value="Artist">Artist</option>
          <option value="Idol Artist">Idol Artist</option>
        </select>

        <textarea
          name="bio"
          placeholder="Short Bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="w-full border p-2 rounded-lg"
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        />

        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            className="w-32 h-32 object-cover mt-2 rounded-lg"
          />
        )}

        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-1/2 bg-gray-400 text-white py-2 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-1/2 bg-emerald-600 text-white py-2 rounded-xl cursor-pointer"
          >
            Update
          </button>
        </div>
      </form>

      {/* WORK LIST */}
      <h3 className="text-xl font-semibold mt-6 mb-2 text-emerald-500">
        Work Details
      </h3>

      <table className="w-full border mt-2">
        <thead className="bg-neutral-700 text-white">
          <tr>
            <th className="p-2">Year</th>
            <th className="p-2">Pandel</th>
            <th className="p-2">Theme</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {artistWorks.map((work) => (
            <tr key={work._id} className="border-b">
              <td className="p-2">{work.year}</td>
              <td className="p-2">{work.pandel?.name || "N/A"}</td>
              <td className="p-2">{work.theme?.title || "N/A"}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => startEditingWork(work)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg mr-2 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteWork(work._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* WORK EDIT POPUP */}
      {editWorkData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl w-full max-w-lg transition-colors duration-300">
            <h3 className="text-xl font-semibold mb-4 text-emerald-500">
              Edit Work
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateWork();
              }}
              className="space-y-4"
            >
              {/* Year */}
              <input
                type="number"
                name="year"
                value={editWorkData.year}
                onChange={(e) =>
                  setEditWorkData({ ...editWorkData, year: e.target.value })
                }
                placeholder="Year"
                required
                className="w-full border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              />

              {/* Pandel ID */}
              <input
                type="text"
                name="pandel"
                value={editWorkData.pandel?._id || ""}
                onChange={(e) =>
                  setEditWorkData({
                    ...editWorkData,
                    pandel: { _id: e.target.value, name: editWorkData.pandel?.name || "" },
                  })
                }
                placeholder={editWorkData.pandel ? `Pandel: ${editWorkData.pandel.name}` : "Pandel ObjectId"}
                required
                className="w-full border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              />

              {/* Theme ID */}
              <input
                type="text"
                name="theme"
                value={editWorkData.theme?._id || ""}
                onChange={(e) =>
                  setEditWorkData({
                    ...editWorkData,
                    theme: { _id: e.target.value, name: editWorkData.theme?.name || "" },
                  })
                }
                placeholder={editWorkData.theme ? `Theme: ${editWorkData.theme.name}` : "Theme ObjectId (optional)"}
                className="w-full border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              />

              {/* Description */}
              <textarea
                name="description"
                value={editWorkData.description}
                onChange={(e) =>
                  setEditWorkData({ ...editWorkData, description: e.target.value })
                }
                rows={3}
                placeholder="Description"
                className="w-full border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              />

              {/* Buttons */}
              <div className="flex justify-between gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditWorkData(null)}
                  className="w-1/2 bg-gray-400 text-white py-2 rounded-xl hover:bg-gray-500 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-1/2 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditArtists;
