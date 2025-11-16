import React, { useEffect, useState } from "react";
import axios from "axios";
import EditArtist from "../component/Artist/EditArtists";
import AddWorkDetails from "../component/Artist/AddWorkDetails";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { MdWork } from "react-icons/md";

const ManageArtist = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTab, setActiveTab] = useState(null); // "edit" or "AddWork"
  const [artistIdToEdit, setArtistIdToEdit] = useState(null);
  const [artistIdToAddWork, setArtistIdToAddWork] = useState(null);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/artist");
      setArtists(res.data);
    } catch (err) {
      console.error("Error fetching artists:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artist?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/artist/${id}`);
      fetchArtists();
    } catch (err) {
      console.error("Error deleting artist:", err);
      alert("Error deleting artist!");
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      fetchArtists();
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/artist/search/${query}`);
      setSearchResults(res.data);
      setArtists(res.data);
    } catch (err) {
      console.error("Error searching artists:", err);
    }
  };

  const handleEdit = (id) => {
    setArtistIdToEdit(id);
    setActiveTab("edit");
  };

  const handleAddWork = (id) => {
    setArtistIdToAddWork(id);
    setActiveTab("AddWork");
  };

  const handleBackToList = () => {
    setActiveTab(null);
    setArtistIdToEdit(null);
    setArtistIdToAddWork(null);
    fetchArtists();
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  return (
    <div className="">
      {!activeTab && (
        <>
          <h2 className="text-2xl font-semibold text-emerald-500 mb-4">Manage Artists</h2>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Artist..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="px-4 py-2 w-full sm:w-96 rounded-md bg-emerald-50 text-black dark:bg-neutral-800 dark:text-emerald-50 border border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Loading Spinner */}
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="loader border-4 border-gray-700 border-t-emerald-500 rounded-full w-8 h-8 animate-spin"></div>
            </div>
          ) : artists.length === 0 ? (
            <p className="text-gray-400">No artists found.</p>
          ) : (
            <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-800">
              <table className="w-full border-collapse">
                <thead className="bg-emerald-700 text-left text-gray-100">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artists.map((artist) => (
                    <tr
                      key={artist._id}
                      className="border-b border-gray-800 hover:bg-emerald-100 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <td className="py-3 px-4 text-black dark:text-white">{artist._id}</td>
                      <td className="py-3 px-4 text-black dark:text-white">{artist.name}</td>
                      <td className="py-3 px-4 text-black dark:text-white">{artist.role}</td>
                      <td className="py-3 px-4 text-center flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(artist._id)}
                          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                          title="Edit"
                        >
                          <FiEdit className="text-white cursor-pointer" />
                        </button>

                        <button
                          onClick={() => handleAddWork(artist._id)}
                          className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition"
                          title="Add Work"
                        >
                          <MdWork className="text-white cursor-pointer" />
                        </button>

                        <button
                          onClick={() => handleDelete(artist._id)}
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

      {/* Conditional Rendering for Edit/AddWork */}
      {activeTab === "edit" && artistIdToEdit && (
        <EditArtist artistIdToEdit={artistIdToEdit} onBack={handleBackToList} />
      )}

      {activeTab === "AddWork" && artistIdToAddWork && (
        <AddWorkDetails artistIdToAddWork={artistIdToAddWork} onBack={handleBackToList} />
      )}
    </div>
  );
};

export default ManageArtist;
