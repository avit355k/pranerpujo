import React, { useEffect, useState } from "react";
import axios from "axios";
import EditPandel from "../component/Pandel/EditPandel";

import { Box, Autocomplete, TextField, CircularProgress } from "@mui/material";

const ManagePandel = () => {
  const [pandels, setPandels] = useState([]);
  const [allPandelsBackup, setAllPandelsBackup] = useState([]); // keep original list
  const [pandelIdToEdit, setPandelIdToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState("list");

  // MUI Autocomplete state
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all pandels
  const fetchPandels = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pandel");
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
      await axios.delete(`http://localhost:5000/api/pandel/delete/${id}`);
      alert("Pandel deleted successfully");
      fetchPandels();
      setInputValue("");
      setOptions([]);
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

  // Live search
  const handleSearch = async (query) => {
    setInputValue(query);

    if (!query.trim()) {
      setPandels(allPandelsBackup);
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/pandel/search?query=${encodeURIComponent(query)}`
      );
      setOptions(res.data);
      setPandels(res.data); // update table
    } catch (err) {
      console.error("Error searching pandels:", err);
      setOptions([]);
      setPandels([]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-4">
      {activeTab === "list" && (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-emerald-500">
            Manage Pandels
          </h2>

          {/* 🔍 Search bar */}
          <Box sx={{ mb: 4, maxWidth: 400 }}>
            <Autocomplete
              freeSolo
              options={options.map((p) => p.name)}
              inputValue={inputValue}
              onInputChange={(e, value) => handleSearch(value)}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Pandel"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "white", // light mode default
                      color: "black",
                    },
                    "& .MuiInputLabel-root": {
                      color: "black",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      "& fieldset": {
                        borderColor: "#10B981", // green focus
                      },
                    },
                    "& .MuiAutocomplete-input": {
                      color: "inherit",
                    },
                    // Dark mode support
                    "@media (prefers-color-scheme: dark)": {
                      "& .MuiInputBase-root": {
                        backgroundColor: "#1e1e1e", // same as your table bg
                        color: "#f0f0f0",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#f0f0f0",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        "& fieldset": {
                          borderColor: "#10B981",
                        },
                      },
                    },
                  }}
                />
              )}
            />
          </Box>


          {/* 🧾 Your existing table (kept exactly as is) */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-neutral-700">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Id</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Edit</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {pandels.map((pandel) => (
                <tr key={pandel._id} className="text-center">
                  <td className="p-2 border">{pandel.name}</td>
                  <td className="p-2 border">{pandel._id}</td>
                  <td className="p-2 border">{pandel.type}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleEdit(pandel._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleDelete(pandel._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === "edit" && pandelIdToEdit && (
        <EditPandel pandelIdToEdit={pandelIdToEdit} onBack={handleBackToList} />
      )}
    </div>
  );
};

export default ManagePandel;
