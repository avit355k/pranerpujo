import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../services/api";
import Select from "react-select";

const EditAwards = ({ awardIdToEdit, onBack }) => {
  const [formData, setFormData] = useState({
    awardName: "",
    logo: "",
  });

  const [winners, setWinners] = useState([]);
  const [pandelsList, setPandelsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch pandels for searchable dropdown
  const fetchPandels = async () => {
    const res = await axios.get(`${API}/api/pandel`);
    const formatted = res.data.map((p) => ({
      value: p._id,
      label: p.name,
    }));
    setPandelsList(formatted);
  };

  // Fetch award details
  const fetchAward = async () => {
    try {
      const res = await axios.get(
        `${API}/api/awards/${awardIdToEdit}`
      );
      const { awardName, logo, winners } = res.data;
      setFormData({ awardName, logo });
      setWinners(winners || []);
    } catch (err) {
      alert("Failed to load award details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAward();
    fetchPandels();
  }, [awardIdToEdit]);

  // update award name/logo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API}/api/awards/${awardIdToEdit}`, formData);
      alert("Award updated successfully!");
      onBack();
    } catch (err) {
      alert("Failed to update award.");
    } finally {
      setSaving(false);
    }
  };

  // update inner winner
  const updateWinner = async (win) => {
    try {
      await axios.put(
        `${API}/api/awards/${awardIdToEdit}/winner/${win._id}`,
        {
          year: win.year,
          pandels: win.pandels,
        }
      );
      alert("Winner updated!");
    } catch (err) {
      alert("Failed to update winner");
    }
  };

  // delete winner
  const deleteWinner = async (id) => {
    if (!window.confirm("Delete this year entry?")) return;

    try {
      await axios.delete(
        `${API}/api/awards/${awardIdToEdit}/winner/${id}`
      );

      setWinners(winners.filter((w) => w._id !== id));
      alert("Deleted successfully");
    } catch (err) {
      alert("Failed to delete");
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
    <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-emerald-500 mb-6">
        ✏️ Edit Award
      </h2>

      {/* Award Info */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block mb-1">Award Name</label>
          <input
            type="text"
            value={formData.awardName}
            onChange={(e) =>
              setFormData({ ...formData, awardName: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md bg-emerald-50 dark:bg-neutral-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1">Logo URL</label>
          <input
            type="text"
            value={formData.logo}
            onChange={(e) =>
              setFormData({ ...formData, logo: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md bg-emerald-50 dark:bg-neutral-700 dark:text-white"
          />

          {formData.logo && (
            <img
              src={formData.logo}
              className="w-20 h-20 mt-3 object-cover rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 text-white rounded-md"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Editable Winners */}
      <h3 className="text-xl font-semibold mb-2 text-emerald-500">
        🏆 Edit Year-wise Winners
      </h3>

      {winners.map((win, index) => (
        <div
          key={win._id}
          className="p-4 bg-emerald-50 dark:bg-neutral-900 rounded-lg border border-gray-700 mb-4"
        >
          {/* Year */}
          <label className="font-semibold mb-1 block">Year</label>
          <input
            type="number"
            value={win.year}
            onChange={(e) => {
              const updated = [...winners];
              updated[index].year = e.target.value;
              setWinners(updated);
            }}
            className="w-full px-3 py-2 mb-3 border rounded-md dark:bg-neutral-700 dark:text-white"
          />

          {/* Pandels Multi Select */}
          <label className="font-semibold mb-1 block">Pandels</label>
          <Select
            isMulti
            options={pandelsList}
            value={win.pandels.map((p) => ({
              value: typeof p === "string" ? p : p._id,
              label: typeof p === "string" ? "" : p.name,
            }))}
            onChange={(selected) => {
              const updated = [...winners];
              updated[index].pandels = selected.map((s) => s.value);
              setWinners(updated);
            }}
            placeholder="Search pandels..."
            className="mb-3"
          />

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => updateWinner(win)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Update Winner
            </button>

            <button
              onClick={() => deleteWinner(win._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Delete Year
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={onBack}
        className="px-4 py-2 mt-4 bg-gray-600 text-white rounded-md"
      >
        ← Back
      </button>
    </div>
  );
};

export default EditAwards;
