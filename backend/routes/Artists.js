const express = require("express");
const router = express.Router();
const Artist = require("../model/artists");
const Pandel = require("../model/pandels");
const Theme = require("../model/theme");

// ✅ Create a new artist (name and role required)
router.post("/create", async (req, res) => {
  try {
    const { name, role, bio, image } = req.body;

    // Validate required fields
    if (!name || !role) {
      return res.status(400).json({ message: "Both name and role are required" });
    }

    const newArtist = new Artist({ name, role, bio, image });
    await newArtist.save();

    res.status(201).json({ message: "Artist created successfully", artist: newArtist });
  } catch (error) {
    console.error("Error creating artist:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


// ✅ Get all artists
router.get("/", async (req, res) => {
  try {
    const artists = await Artist.find().sort({ name: 1 });
    res.status(200).json(artists);
  } catch (error) {
    console.error("Error fetching artists:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Get single artist by ID
router.get("/:id", async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id).populate("works.pandel works.theme");
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.status(200).json(artist);
  } catch (error) {
    console.error("Error fetching artist:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Update artist info
router.put("/:id", async (req, res) => {
  try {
    const updated = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.status(200).json({ message: "Artist updated", artist: updated });
  } catch (error) {
    console.error("Error updating artist:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Delete artist
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Artist.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.status(200).json({ message: "Artist deleted" });
  } catch (error) {
    console.error("Error deleting artist:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Add a work entry to an artist
router.post("/:id/work", async (req, res) => {
  try {
    const { year, pandel, theme, description } = req.body;

    if (!year || !pandel || !theme) {
      return res.status(400).json({ message: "Year, pandel, and theme are required" });
    }

    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const existingPandel = await Pandel.findById(pandel);
    const existingTheme = await Theme.findById(theme);
    if (!existingPandel || !existingTheme) {
      return res.status(404).json({ message: "Pandel or Theme not found" });
    }

    artist.works.push({ year, pandel, theme, description });
    await artist.save();

    res.status(200).json({ message: "Work added to artist", artist });
  } catch (error) {
    console.error("Error adding work:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
