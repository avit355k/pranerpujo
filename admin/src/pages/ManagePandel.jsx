import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../services/api";
import EditPandel from "../component/Pandel/EditPandel";

const ManagePandel = () => {
  const [pandels, setPandels] = useState([]);
  const [allPandelsBackup, setAllPandelsBackup] = useState([]);
  const [pandelIdToEdit, setPandelIdToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState("list");

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all pandels
  const fetchPandels = async () => {
    try {
      const res = await axios.get(`${API}/api/pandel`);
      setPandels(res.data);
      setAllPandelsBackup(res.data);
    } catch (err) {
      console.error("Error fetching pandels:", err);
    }
  };

  useEffect(() => {
    fetchPandels();
  }, []);

  // ✅ Handle Edit
  const handleEdit = (id) => {
    setPandelIdToEdit(id);
    setActiveTab("edit");
  };

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pandel?")) return;
    try {
      await axios.delete(`${API}/api/pandel/delete/${id}`);
      alert("Pandel deleted successfully");
      fetchPandels();
      setInputValue("");
    } catch (err) {
      console.error("Error deleting pandel:", err);
      alert("Failed to delete pandel");
    }
  };

  // ✅ Go back to list after editing
  const handleBackToList = () => {
    setPandelIdToEdit(null);
    setActiveTab("list");
    fetchPandels();
  };

  // ✅ Search (local + API)
  const handleSearch = async (query) => {
    setInputValue(query);

    if (!query.trim()) {
      setPandels(allPandelsBackup);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${API}/api/pandel/search?query=${encodeURIComponent(query)}`
      );
      setPandels(res.data);
    } catch (err) {
      console.error("Error searching pandels:", err);
      setPandels([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {activeTab === "list" && (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-emerald-500">
            Manage Pandels
          </h2>

          {/* 🔍 Search Bar */}
          <div className="relative w-full sm:w-96 mb-6">
            <input
              type="text"
              placeholder="Search Pandel..."
              value={inputValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-900 
                dark:text-white dark:border-gray-700 transition-all duration-200"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {loading && (
              <div className="absolute right-3 top-2.5 animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-emerald-500"></div>
            )}
          </div>

          {/* 🧾 Pandel Table */}
          <div className="overflow-x-auto bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200">
                  <th className="p-3 border dark:border-gray-700">Name</th>
                  <th className="p-3 border dark:border-gray-700">Id</th>
                  <th className="p-3 border dark:border-gray-700">Type</th>
                  <th className="p-3 border dark:border-gray-700">Edit</th>
                  <th className="p-3 border dark:border-gray-700">Delete</th>
                </tr>
              </thead>
              <tbody>
                {pandels.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                      {loading ? "Searching..." : "No pandels found"}
                    </td>
                  </tr>
                ) : (
                  pandels.map((pandel) => (
                    <tr
                      key={pandel._id}
                      className="text-center border-t border-gray-200 dark:border-gray-700 
                        hover:bg-emerald-50 dark:hover:bg-neutral-800 transition"
                    >
                      <td className="p-3 border dark:border-gray-700">{pandel.name}</td>
                      <td className="p-3 border dark:border-gray-700">{pandel._id}</td>
                      <td className="p-3 border dark:border-gray-700">{pandel.type}</td>
                      <td className="p-3 border dark:border-gray-700">
                        <button
                          onClick={() => handleEdit(pandel._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                      </td>
                      <td className="p-3 border dark:border-gray-700">
                        <button
                          onClick={() => handleDelete(pandel._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "edit" && pandelIdToEdit && (
        <EditPandel pandelIdToEdit={pandelIdToEdit} onBack={handleBackToList} />
      )}
    </div>
  );
};

export default ManagePandel;
