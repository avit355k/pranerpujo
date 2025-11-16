import React, { useState, useRef } from "react";
import axios from "axios";
import { API } from "../../services/api";

const AddArtist = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    image: "",
  });

  const isSubmitting = useRef(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      const res = await axios.post(
        `${API}/api/artist/create`,
        formData
      );

      if (res.status === 201 || res.data?.artist) {
        alert("✅ Artist added successfully!");
        setFormData({ name: "", role: "", bio: "", image: "" });
      } else {
        alert("⚠️ Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error adding artist:", err);
      alert("❌ Error adding artist. Please try again.");
    } finally {
      isSubmitting.current = false;
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-md transition-colors duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-500">
        Add Artist
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input
          type="text"
          name="name"
          placeholder="Artist Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />

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

        <textarea
          name="bio"
          placeholder="Short Bio (optional)"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="w-full border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />

        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://placehold.co/150"
            className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2  focus:ring-emerald-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition cursor-pointer"
        >
          Add Artist
        </button>
      </form>
    </div>
  );
};

export default AddArtist;
