import React, { useState } from "react";
import axios from "axios";
import { API } from "../../services/api";

const AddWorkDetails = ({ artistIdToAddWork, onBack }) => {
  const [formData, setFormData] = useState({
    year: "",
    pandel: "",
    theme: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.year || !formData.pandel) {
      alert("⚠️ Year and Pandel ID are required.");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/api/artist/${artistIdToAddWork}/work`,
        formData
      );

      if (res.status === 200) {
        // ✅ No need for alert; just go back silently
        onBack();
      }
    } catch (err) {
      console.error("Error adding work:", err);
      alert("❌ Error adding work details. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-md transition-colors duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-500">
        Add Work Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Year */}
        <div>
          <label className="block text-gray-700 dark:text-neutral-200 mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="e.g. 2025"
            required
            className="w-full border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Pandel ID */}
        <div>
          <label className="block text-gray-700 dark:text-neutral-200 mb-1">
            Pandel ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pandel"
            value={formData.pandel}
            onChange={handleChange}
            placeholder="Enter Pandel ObjectId"
            required
            className="w-full border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Theme ID (optional) */}
        <div>
          <label className="block text-gray-700 dark:text-neutral-200 mb-1">
            Theme ID (optional)
          </label>
          <input
            type="text"
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            placeholder="Enter Theme ObjectId (optional)"
            className="w-full border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 dark:text-neutral-200 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Short description of the work"
            className="w-full border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

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
            Add Work
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkDetails;
