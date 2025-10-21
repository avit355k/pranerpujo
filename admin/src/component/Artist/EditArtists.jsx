import React, { useState, useEffect } from "react";
import axios from "axios";

const EditArtists = ({ artistIdToEdit, onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch artist details on mount
  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/artist/${artistIdToEdit}`);
        if (res.data) {
          setFormData({
            name: res.data.name || "",
            role: res.data.role || "",
            bio: res.data.bio || "",
            image: res.data.image || "",
          });
        }
      } catch (err) {
        console.error("Error fetching artist details:", err);
        alert("❌ Failed to load artist details.");
      } finally {
        setLoading(false);
      }
    };

    if (artistIdToEdit) fetchArtistDetails();
  }, [artistIdToEdit]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Update artist info
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:5000/api/artist/${artistIdToEdit}`,
        formData
      );

      if (res.status === 200) {
        alert("✅ Artist updated successfully!");
        onBack(); // Go back to ManageArtist table view
      } else {
        alert("⚠️ Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error updating artist:", err);
      alert("❌ Error updating artist. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-md text-center text-neutral-500">
        Loading artist details...
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-md transition-colors duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-500">
        Edit Artist Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Artist Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />

        {/* Role */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">Select Role</option>
          <option value="Artist">Artist</option>
          <option value="Idol Artist">Idol Artist</option>
        </select>

        {/* Bio */}
        <textarea
          name="bio"
          placeholder="Short Bio (optional)"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="w-full border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />

        {/* Image URL */}
        <div>
          <label className="block text-gray-600 dark:text-neutral-200 mb-1 font-medium">
            Image URL
          </label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 rounded-xl p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="https://placehold.co/150"
          />
        </div>

        {/* Image Preview */}
        {formData.image && (
          <div className="mt-2">
            <img
              src={formData.image}
              alt="Artist Preview"
              className="w-32 h-32 rounded-lg object-cover border border-gray-300 dark:border-neutral-700"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between gap-3 mt-4">
          <button
            type="button"
            onClick={onBack}
            className="w-1/2 bg-gray-400 text-white py-2 rounded-xl hover:bg-gray-500 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="w-1/2 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition cursor-pointer"
          >
            Update Artist
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArtists;
