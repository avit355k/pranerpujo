const express = require("express");
const router = express.Router();
const multer = require("multer");
const ImageKit = require("imagekit");

const Theme = require("../model/theme.js");
const Pandel = require("../model/pandels");
const Artist = require("../model/artists");

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
//create theme 
router.post("/create", upload.fields([
  { name: "mainImageFile", maxCount: 1 },
  { name: "galleryFiles", maxCount: 10 } // Adjust maxCount as needed
]), async (req, res) => {
  try {
    const {
      title,
      concept,
      year,
      pandel,
      artists,
      youtubeLink,
    } = req.body;

    // Validate required fields
    if (!title || !concept || !year || !pandel) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const numericYear = parseInt(year);
    if (isNaN(numericYear) || numericYear < 1900 || numericYear > new Date().getFullYear()) {
      return res.status(400).json({ message: "Invalid year provided" });
    }

    const duplicate = await Theme.findOne({ pandel, year: numericYear });
    if (duplicate) {
      return res.status(409).json({ message: "Theme already exists for this pandel and year" });
    }

    const existingPandel = await Pandel.findById(pandel);
    if (!existingPandel) {
      return res.status(404).json({ message: "Pandel not found" });
    }

    const parsedArtists = artists ? JSON.parse(artists) : [];
    for (const art of parsedArtists) {
      if (art.artist) {
        const existingArtist = await Artist.findById(art.artist);
        if (!existingArtist) {
          return res.status(404).json({ message: `Artist not found for ID: ${art.artist}` });
        }
      }
    }

    // Upload main image
    let mainImageUrl = req.body.mainImage || null;
    if (req.files["mainImageFile"]) {
      const file = req.files["mainImageFile"][0];
      const fileName = `${title}-${year}-main.jpg`;
      const existingUrl = await checkIfImageExists(fileName);
      if (existingUrl) {
        mainImageUrl = existingUrl;
      } else {
        const uploadResponse = await imagekit.upload({
          file: file.buffer,
          fileName,
          folder: "/pandels",
        });
        mainImageUrl = uploadResponse.url;
      }
    }

    // Upload gallery images
    const galleryUrls = [];
    if (req.files["galleryFiles"]) {
      for (const [index, file] of req.files["galleryFiles"].entries()) {
        const fileName = `${title}-${year}-gallery-${index + 1}.jpg`;
        const uploadResponse = await imagekit.upload({
          file: file.buffer,
          fileName,
          folder: "/pandels/gallery",
        });
        galleryUrls.push(uploadResponse.url);
      }
    }

    // Create and save theme
    const newTheme = new Theme({
      title,
      concept,
      mainImage: mainImageUrl,
      year: numericYear,
      pandel,
      artists: parsedArtists,
      gallery: galleryUrls,
      youtubeLink,
    });

    await newTheme.save();
    res.status(201).json({ message: "Theme created successfully", theme: newTheme });

  } catch (error) {
    console.error("Error creating theme:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// GET themes of a specific pandel by each year
router.get("/pandel/:pandelId/year/:year", async (req, res) => {
  try {
    const { pandelId, year } = req.params;
    const numericYear = parseInt(year);

    const themes = await Theme.find({ pandel: pandelId, year: numericYear })
      .populate("pandel", "name zone logo address")
      .populate("artists.artist", "name role image");

    if (!themes.length)
      return res.status(404).json({ message: "No themes found for this year" });

    res.status(200).json(themes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});
// ✅ UPDATE existing theme
router.put(
  "/:id",
  upload.fields([
    { name: "mainImageFile", maxCount: 1 },
    { name: "galleryFiles", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const theme = await Theme.findById(req.params.id);
      if (!theme) return res.status(404).json({ message: "Theme not found" });

      const {
        title,
        concept,
        year,
        pandel,
        artists,
        youtubeLink,
        existingGallery, // frontend may send existing gallery array
      } = req.body;

      // Upload new main image if provided
      let mainImageUrl = theme.mainImage;
      if (req.files["mainImageFile"]) {
        const file = req.files["mainImageFile"][0];
        const fileName = `${title || theme.title}-${year || theme.year}-main.jpg`;
        const uploadResponse = await imagekit.upload({
          file: file.buffer,
          fileName,
          folder: "/pandels",
        });
        mainImageUrl = uploadResponse.url;
      }

      // Upload new gallery images
      const galleryUrls = existingGallery ? JSON.parse(existingGallery) : theme.gallery;
      if (req.files["galleryFiles"]) {
        for (const [index, file] of req.files["galleryFiles"].entries()) {
          const fileName = `${title || theme.title}-${year || theme.year}-gallery-${index + 1}.jpg`;
          const uploadResponse = await imagekit.upload({
            file: file.buffer,
            fileName,
            folder: "/pandels/gallery",
          });
          galleryUrls.push(uploadResponse.url);
        }
      }

      // Update fields
      theme.title = title || theme.title;
      theme.concept = concept || theme.concept;
      theme.year = year || theme.year;
      theme.pandel = pandel || theme.pandel;
      theme.mainImage = mainImageUrl;
      theme.gallery = galleryUrls;
      theme.youtubeLink = youtubeLink || theme.youtubeLink;
      theme.artists = artists ? JSON.parse(artists) : theme.artists;

      await theme.save();
      res.status(200).json({ message: "Theme updated successfully", theme });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);


// ✅ DELETE theme
router.delete("/:id", async (req, res) => {
  try {
    const theme = await Theme.findByIdAndDelete(req.params.id);
    if (!theme) return res.status(404).json({ message: "Theme not found" });

    res.status(200).json({ message: "Theme deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});


module.exports = router;
