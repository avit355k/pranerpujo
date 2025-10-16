// src/components/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
// Import the new component
import AddPandelForm from "../../component/Admin/AddPandelForm";
import EditPandelForm from "../../component/Admin/Editpandel";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pandels, setPandels] = useState([]);
  const [pandelIdToEdit, setPandelIdToEdit] = useState(null);

  // ✅ Fetch pandels
  const fetchPandels = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pandel");
      setPandels(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "manage") fetchPandels();
  }, [activeTab]);

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pandel?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/pandel/delete/${id}`);
      alert("🗑️ Pandel Deleted");
      fetchPandels();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Handle Edit Click
  const handleEdit = (id) => {
    setPandelIdToEdit(id);
    setActiveTab("edit");
  };

  // Utility function to set the tab, used in Sidebar and internal logic
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    // If we are leaving the 'add' tab, clear the ID just in case
    if (tabName !== "add") {
      setPandelIdToEdit(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-gray-200 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-neutral-800 shadow-lg p-6 rounded-b-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-6">Admin Panel</h2>
        <ul className="space-y-3">
          <li
            className={`cursor-pointer p-2 rounded-lg ${activeTab === "dashboard"
              ? "bg-red-600 text-white"
              : "hover:bg-gray-200 dark:hover:bg-neutral-700"
              }`}
            onClick={() => handleTabChange("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={`cursor-pointer p-2 rounded-lg ${activeTab === "add"
              ? "bg-red-600 text-white"
              : "hover:bg-gray-200 dark:hover:bg-neutral-700"
              }`}
            onClick={() => handleTabChange("add")}
          >
            {/* Display 'Edit Pandel' when an ID is set for editing */}
            {pandelIdToEdit ? "Edit Pandel" : "Add Pandel"}
          </li>
          <li
            className={`cursor-pointer p-2 rounded-lg ${activeTab === "manage"
              ? "bg-red-600 text-white"
              : "hover:bg-gray-200 dark:hover:bg-neutral-700"
              }`}
            onClick={() => handleTabChange("manage")}
          >
            Manage Pandels
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Welcome, Admin 🎉</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all Durga Puja Pandel details here.
            </p>
          </div>
        )}

        {/* Use the new component for 'Add' and 'Edit' */}
        {activeTab === "add" && (
          <AddPandelForm setActiveTab={setActiveTab} fetchPandels={fetchPandels} />
        )}
        {activeTab === "edit" && pandelIdToEdit && (
          <EditPandelForm pandelIdToEdit={pandelIdToEdit} setActiveTab={setActiveTab} fetchPandels={fetchPandels} />
        )}

        {/* Manage Pandels */}
        {activeTab === "manage" && (
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">
              Manage Pandels
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-neutral-700">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Zone</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Edit</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {pandels.map((pandel) => (
                  <tr key={pandel._id} className="text-center">
                    <td className="p-2 border">{pandel.name}</td>
                    <td className="p-2 border">{pandel.zone}</td>
                    <td className="p-2 border">{pandel.type}</td>
                    <td className="p-2 border">
                      <button
                        // Use pandel._id here
                        onClick={() => handleEdit(pandel._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleDelete(pandel._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
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
      </main>
    </div>
  );
};

export default Dashboard;