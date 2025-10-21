import React, { useEffect, useState } from "react";
import axios from "axios";
import EditArtist from "../component/Artist/EditArtists";
import AddWorkDetails from "../component/Artist/AddWorkDetails";

import {
  Box,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Autocomplete,
  Paper,
  Tooltip,
} from "@mui/material";

import { Delete, Edit, Work } from "@mui/icons-material";

const ManageArtist = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // For switching tabs
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

  // Live search
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

  // Handle Edit
  const handleEdit = (id) => {
    setArtistIdToEdit(id);
    setActiveTab("edit");
  };

  // Handle Add Work
  const handleAddWork = (id) => {
    setArtistIdToAddWork(id);
    setActiveTab("AddWork");
  };

  // Back to list
  const handleBackToList = () => {
    setActiveTab(null);
    setArtistIdToEdit(null);
    setArtistIdToAddWork(null);
    fetchArtists();
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  // Dark/neutral color styling
  const tableBg = "#1e1e1e";
  const tableHeaderBg = "#2e2e2e";
  const tableHeaderColor = "#e0e0e0";
  const tableRowColor = "#f0f0f0";

  return (
    <>
      

      {!activeTab && (
        
        <Box sx={{ pt:0, pb: 4, px: 2 }}>
          <h2 className="text-xl text-emerald-600 font-bold mb-2 ">Manage Artists</h2>
          {/* Search box */}
          <Autocomplete
            freeSolo
            options={searchResults.map((a) => a.name)}
            inputValue={searchQuery}
            onInputChange={(e, value) => handleSearch(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Artist"
                variant="outlined"
                fullWidth
                sx={{ mb: 3, maxWidth: 400 }}
              />
            )}
          />

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : artists.length === 0 ? (
            <p>No artists found.</p>
          ) : (
            <Paper
              sx={{
                overflow: "hidden",
                borderRadius: 3,
                boxShadow: 3,
                backgroundColor: tableBg,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor:  "##009966"  }}>
                    <TableCell sx={{color: "white", fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{color: "white", fontWeight: "bold" }}>Role</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {artists.map((artist) => (
                    <TableRow key={artist._id} hover sx={{ color: tableRowColor }}>
                      <TableCell sx={{ color: tableRowColor }}>{artist._id}</TableCell>
                      <TableCell sx={{ color: tableRowColor }}>{artist.name}</TableCell>
                      <TableCell sx={{ color: tableRowColor }}>{artist.role}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton color="primary" onClick={() => handleEdit(artist._id)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Add Work">
                          <IconButton color="success" onClick={() => handleAddWork(artist._id)}>
                            <Work />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDelete(artist._id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>
      )}

      {/* Conditional rendering of Edit/AddWork */}
      {activeTab === "edit" && artistIdToEdit && (
        <EditArtist artistIdToEdit={artistIdToEdit} onBack={handleBackToList} />
      )}
      {activeTab === "AddWork" && artistIdToAddWork && (
        <AddWorkDetails artistIdToAddWork={artistIdToAddWork} onBack={handleBackToList} />
      )}
    </>
  );
};

export default ManageArtist;
