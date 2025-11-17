import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../services/api";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { MdPlaylistAdd } from "react-icons/md";
import EditAwards from "../component/Awards/EditAwards";
import AddWinners from "../component/Awards/AddWinners";

const ManageAwards = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(null); // "add" | "edit"
  const [awardIdToEdit, setAwardIdToEdit] = useState(null);
  const [awardIdForWinner, setAwardIdForWinner] = useState(null);

  // Fetch all awards
  const fetchAwards = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/awards`);
      setAwards(res.data);
    } catch (err) {
      console.error("Error fetching awards:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete award
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this award?")) return;
    try {
      await axios.delete(`${API}/api/awards/${id}`);
      fetchAwards();
    } catch (err) {
      console.error("Error deleting award:", err);
      alert("Failed to delete award!");
    }
  };

  // Search awards
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      fetchAwards();
      return;
    }

    try {
      const res = await axios.get(
        `${API}/api/awards/search/${query}`
      );
      setAwards(res.data);
    } catch (err) {
      console.error("Error searching awards:", err);
    }
  };

  const handleEdit = (id) => {
    setAwardIdToEdit(id);
    setActiveTab("edit");
  };

  const handleAddWinner = (id) => {
    setAwardIdForWinner(id);
    setActiveTab("add");
  };

  const handleBackToList = () => {
    setActiveTab(null);
    setAwardIdToEdit(null);
    setAwardIdForWinner(null);
    fetchAwards();
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  return (
    <div>
      {!activeTab && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-emerald-500">
              Manage Awards
            </h2>
          </div>

          {/* Search bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Awards..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="px-4 py-2 w-full sm:w-96 rounded-md bg-emerald-50 text-black dark:bg-neutral-800 dark:text-emerald-50 border border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="loader border-4 border-gray-700 border-t-emerald-500 rounded-full w-8 h-8 animate-spin"></div>
            </div>
          ) : awards.length === 0 ? (
            <p className="text-gray-400">No awards found.</p>
          ) : (
            <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-800">
              <table className="w-full border-collapse">
                <thead className="bg-emerald-700 text-left text-gray-100">
                  <tr>
                    <th className="py-3 px-4">Award Name</th>
                    <th className="py-3 px-4">Logo</th>
                    <th className="py-3 px-4">Winners</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {awards.map((award) => (
                    <tr
                      key={award._id}
                      className="border-b border-gray-800 hover:bg-emerald-100 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <td className="py-3 px-4 text-black dark:text-white font-medium">
                        {award.awardName}
                      </td>

                      <td className="py-3 px-4">
                        {award.logo ? (
                          <img
                            src={award.logo}
                            alt={award.awardName}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                          />
                        ) : (
                          <span className="text-gray-400">No Logo</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-black dark:text-white">
                        {award.winners && award.winners.length > 0 ? (
                          <ul className="space-y-2">
                            {award.winners.map((winner, index) => (
                              <li key={index}>
                                <span className="font-semibold text-emerald-600">
                                  {winner.year}
                                </span>
                                {winner.pandels &&
                                winner.pandels.length > 0 ? (
                                  <ul className="ml-4 list-disc text-sm text-gray-400">
                                    {winner.pandels.map((pandel, i) => (
                                      <li key={i}>{pandel.name || pandel}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-gray-400">
                                    No pandels listed
                                  </p>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-400">No winners yet</p>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(award._id)}
                          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                          title="Edit Award"
                        >
                          <FiEdit className="text-white cursor-pointer" />
                        </button>

                        <button
                          onClick={() => handleAddWinner(award._id)}
                          className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition"
                          title="Add New Winner"
                        >
                          <MdPlaylistAdd className="text-white cursor-pointer" />
                        </button>

                        <button
                          onClick={() => handleDelete(award._id)}
                          className="p-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
                          title="Delete"
                        >
                          <FiTrash2 className="text-white cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Conditional Rendering */}
      {activeTab === "add" && awardIdForWinner && (
        <AddWinners awardId={awardIdForWinner} onBack={handleBackToList} />
      )}
      {activeTab === "edit" && awardIdToEdit && (
        <EditAwards awardIdToEdit={awardIdToEdit} onBack={handleBackToList} />
      )}
    </div>
  );
};

export default ManageAwards;
