import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../services/api";
import Select from "react-select"; // ✅ Import react-select

const AddWinners = ({ awardId, onBack }) => {
  const [award, setAward] = useState(null);
  const [pandels, setPandels] = useState([]);
  const [formData, setFormData] = useState({
    year: "",
    pandels: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [awardRes, pandelRes] = await Promise.all([
          axios.get(`${API}/api/awards/${awardId}`),
          axios.get(`${API}/api/pandel`),
        ]);
        setAward(awardRes.data);
        setPandels(
          pandelRes.data.map((p) => ({ value: p._id, label: p.name })) // ✅ Convert for react-select
        );
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    if (awardId) fetchData();
  }, [awardId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.year || formData.pandels.length === 0) {
      alert("Please fill in all fields.");
      return;
    }

    setSaving(true);
    try {
      await axios.post(
        `${API}/api/awards/${awardId}/yearwise`,
        {
          year: parseInt(formData.year),
          pandels: formData.pandels.map((p) => p.value), // ✅ Send only IDs
        }
      );

      alert("Winner(s) added successfully!");
      setFormData({ year: "", pandels: [] });
      onBack();
    } catch (err) {
      console.error("Error adding winners:", err);
      alert("Failed to add winners.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="loader border-4 border-gray-700 border-t-emerald-500 rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-md transition-colors duration-300">
      <h2 className="text-2xl font-semibold text-emerald-500 mb-6">
        🏆 Add Year-wise Winners for {award?.awardName}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Year */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Year
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="Enter year (e.g. 2025)"
            className="w-full px-4 py-2 border rounded-md bg-emerald-50 dark:bg-neutral-700 dark:text-white border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Searchable Multi-Select for Pandels */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Search and Select Winning Pandels
          </label>
          <Select
            isMulti
            options={pandels}
            value={formData.pandels}
            onChange={(selected) =>
              setFormData({ ...formData, pandels: selected })
            }
            placeholder="Type to search pandels..."
            className="text-black dark:text-white"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#f0fdf4", // light emerald shade
                borderColor: "#10b981",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#fff",
                zIndex: 20,
              }),
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white transition cursor-pointer"
          >
            ← Back
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer"
          >
            {saving ? "Saving..." : "Add Winners"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWinners;
