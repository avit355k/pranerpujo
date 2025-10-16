const express = require("express");
const router = express.Router();
const Pandel = require("../model/pandels");
const multer = require("multer");
const ImageKit = require("imagekit");

// ImageKit configuration
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Multer setup (memory storage — image not saved locally)
const storage = multer.memoryStorage();
const upload = multer({ storage });
// Helper: Check if image already exists in ImageKit
async function checkIfImageExists(fileName) {
  try {
    const files = await imagekit.listFiles({
      searchQuery: `name = "${fileName}" AND folder = "/pandels"`,
    });

    return files.length > 0 ? files[0].url : null;
  } catch (err) {
    console.error("Error checking existing image:", err.message);
    return null;
  }
}
// Create Pandel (with optional logo upload)
router.post("/create", upload.single("logo"), async (req, res) => {
  try {
    let logoUrl = null;

    // Generate consistent file name based on Pandel name
    const fileName = req.body.name
      ? `logo_${req.body.name.replace(/\s+/g, "_").toLowerCase()}.png`
      : null;

    // Upload logo to ImageKit if present
    if (req.file && fileName) {
      const existingUrl = await checkIfImageExists(fileName);

      if (existingUrl) {
        logoUrl = existingUrl; // Use existing image URL
      } else {
        const uploadedImage = await imagekit.upload({
          file: req.file.buffer, // image buffer from multer
          fileName: fileName,
          folder: "/pandels", // optional folder in ImageKit
        });
        logoUrl = uploadedImage.url;
      }
    }

    // Create new Pandel document
    const pandel = new Pandel({
      name: req.body.name,
      location: JSON.parse(req.body.location), // frontend sends JSON string
      logo: logoUrl,
      address: req.body.address,
      founded: req.body.founded,
      type: req.body.type,
      zone: req.body.zone,
      nearestLocation: req.body.nearestLocation
        ? JSON.parse(req.body.nearestLocation)
        : {},
      contactNumbers: req.body.contactNumbers
        ? JSON.parse(req.body.contactNumbers)
        : [],
      email: req.body.email,
      socialLinks: req.body.socialLinks
        ? JSON.parse(req.body.socialLinks)
        : {},
    });

    // Save to DB
    await pandel.save();

    return res.status(201).json({ message: "Pandel added successfully", pandel });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
//GET all Pandels
router.get("/", async (req, res) => {
  try {
    const pandels = await Pandel.find().sort({ createdAt: -1 });
    res.status(200).json(pandels);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pandels", error: error.message });
  }
});
//GET single Pandel by ID
router.get("/:id", async (req, res) => {
  try {
    const pandel = await Pandel.findById(req.params.id);

    if (!pandel) {
      return res.status(404).json({ message: "Pandel not found" });
    }

    return res.status(200).json(pandel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

//UPDATE Pandel
router.put("/update/:id", upload.single("logo"), async (req, res) => {
  try {
    const existingPandel = await Pandel.findById(req.params.id);
    if (!existingPandel)
      return res.status(404).json({ message: "Pandel not found" });

    let logoUrl = existingPandel.logo;
    const fileName = req.body.name
      ? `logo_${req.body.name.replace(/\s+/g, "_").toLowerCase()}.png`
      : null;

    // Upload new logo if provided
    if (req.file && fileName) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: fileName,
        folder: "/pandels",
      });
      logoUrl = uploadedImage.url;
    }

    const updatedData = {
      name: req.body.name || existingPandel.name,
      location: req.body.location
        ? JSON.parse(req.body.location)
        : existingPandel.location,
      logo: logoUrl,
      address: req.body.address || existingPandel.address,
      founded: req.body.founded
        ? Number(req.body.founded)
        : existingPandel.founded,
      type: req.body.type || existingPandel.type,
      zone: req.body.zone || existingPandel.zone,
      nearestLocation: req.body.nearestLocation
        ? JSON.parse(req.body.nearestLocation)
        : existingPandel.nearestLocation,
      contactNumbers: req.body.contactNumbers
        ? JSON.parse(req.body.contactNumbers)
        : existingPandel.contactNumbers,
      email: req.body.email || existingPandel.email,
      socialLinks: req.body.socialLinks
        ? JSON.parse(req.body.socialLinks)
        : existingPandel.socialLinks,
    };

    const updatedPandel = await Pandel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Pandel updated successfully", updatedPandel });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating pandel", error: error.message });
  }
});
//DELETE Pandel
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedPandel = await Pandel.findByIdAndDelete(req.params.id);
    if (!deletedPandel)
      return res.status(404).json({ message: "Pandel not found" });

    res.status(200).json({ message: "Pandel deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting pandel", error: error.message });
  }
});
//  Get all Pandels by Zone(north/south...etc)
router.get("/zone/:zone", async (req, res) => {
  try {
    const zone = req.params.zone;
    const pandels = await Pandel.find({ zone });
    if (!pandels.length)
      return res.status(404).json({ message: `No pandels found in ${zone}` });
    res.status(200).json(pandels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching zone-wise pandels", error: error.message });
  }
});

//  Get all Pandels by Type(Barowari/Bonedibari)
router.get("/type/:type", async (req, res) => {
  try {
    const type = req.params.type;
    const pandels = await Pandel.find({ type });
    if (!pandels.length)
      return res.status(404).json({ message: `No pandels found for type ${type}` });
    res.status(200).json(pandels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching type-wise pandels", error: error.message });
  }
});
module.exports = router;
