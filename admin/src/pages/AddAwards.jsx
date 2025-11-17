import React, { useState } from "react";
import axios from "axios";
import { API } from "../services/api";

const AddAwards = () => {
  const [formData, setFormData] = useState({
    awardName: "",
    logo: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(`${API}/api/awards`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 201) {
        setMessage("✅ Award created successfully!");
        setFormData({ awardName: "", logo: "" }); // reset form
      }
    } catch (err) {
      setError(err.response?.data?.error || "❌ Failed to create award.");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-md transition-colors duration-300 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-emerald-500 text-center">
        Add New Award
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Award Name */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Award Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="awardName"
            value={formData.awardName}
            onChange={handleChange}
            placeholder="Enter award name"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Logo URL
          </label>
          <input
            type="text"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            placeholder="Enter logo image URL"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer"
        >
          Add Award
        </button>
      </form>

      {/* Status Messages */}
      {message && (
        <p className="mt-4 text-green-500 text-center font-medium">{message}</p>
      )}
      {error && (
        <p className="mt-4 text-red-500 text-center font-medium">{error}</p>
      )}
    </div>
  );
};

export default AddAwards;
