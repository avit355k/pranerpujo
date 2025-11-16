const express = require("express");
const router = express.Router();
const multer = require("multer");
const ImageKit = require("imagekit");

const Theme = require("../model/theme");
const Pandel = require("../model/pandels");
const Artist = require("../model/artists");

// 🔧 ImageKit configuration
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// 🧠 In-memory cache
const uploadedImageCache = new Map();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔍 Helper: Check if an image exists in ImageKit
async function checkIfImageExists(fileName, folder = "/pandels") {
  const cacheKey = `${folder}/${fileName}`;
  if (uploadedImageCache.has(cacheKey)) return uploadedImageCache.get(cacheKey);

  try {
    const files = await imagekit.listFiles({
      searchQuery: `name="${fileName}" AND folder="${folder}"`,
      limit: 1,
    });

    if (files.length > 0) {
      const existingUrl = files[0].url;
      uploadedImageCache.set(cacheKey, existingUrl);
      return existingUrl;
    }
    return null;
  } catch (err) {
    console.error("Error checking existing image:", err.message);
    return null;
  }
}

// 🧹 Helper: Delete ImageKit file by URL
async function deleteImageByUrl(url) {
  try {
    const parts = url.split("/"); // Extract file name from URL
    const fileName = parts[parts.length - 1];
    const folder = "/" + parts[parts.length - 2];

    const files = await imagekit.listFiles({
      searchQuery: `name="${fileName}" AND folder="${folder}"`,
      limit: 1,
    });

    if (files.length > 0) {
      await imagekit.deleteFile(files[0].fileId);
      console.log(`🗑️ Deleted from ImageKit: ${fileName}`);
    }
  } catch (err) {
    console.error("❌ Failed to delete image:", err.message);
  }
}

/* ======================================================
   ✅ CREATE THEME
====================================================== */
router.post(
  "/create",
  upload.fields([
    { name: "mainImageFile", maxCount: 1 },
    { name: "galleryFiles", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { title, concept, year, pandel, artists, youtubeLink } = req.body;

      if (!title || !concept || !year || !pandel)
        return res.status(400).json({ message: "Missing required fields" });

      const numericYear = parseInt(year);
      if (isNaN(numericYear) || numericYear < 1900 || numericYear > new Date().getFullYear())
        return res.status(400).json({ message: "Invalid year provided" });

      const duplicate = await Theme.findOne({ pandel, year: numericYear });
      if (duplicate)
        return res.status(409).json({ message: "Theme already exists for this pandel and year" });

      const existingPandel = await Pandel.findById(pandel);
      if (!existingPandel) return res.status(404).json({ message: "Pandel not found" });

      const parsedArtists = artists ? JSON.parse(artists) : [];
      for (const art of parsedArtists) {
        if (art.artist) {
          const existingArtist = await Artist.findById(art.artist);
          if (!existingArtist)
            return res.status(404).json({ message: `Artist not found for ID: ${art.artist}` });
        }
      }

      // 🖼️ Upload main image
      let mainImageUrl = null;
      if (req.files["mainImageFile"]?.[0]) {
        const file = req.files["mainImageFile"][0];
        const fileName = `${title}-${year}-main.jpg`;

        mainImageUrl =
          (await checkIfImageExists(fileName, "/pandels")) ||
          (await imagekit.upload({
            file: file.buffer,
            fileName,
            folder: "/pandels",
          }).then((r) => {
            uploadedImageCache.set(`/pandels/${fileName}`, r.url);
            return r.url;
          }));
      }

      // 🖼️ Upload gallery images (parallel)
      let galleryUrls = [];
      if (req.files["galleryFiles"]?.length > 0) {
        const uploadPromises = req.files["galleryFiles"].map(async (file, index) => {
          const fileName = `${title}-${year}-gallery-${index + 1}.jpg`;

          const existingUrl = await checkIfImageExists(fileName, "/pandels/gallery");
          if (existingUrl) return existingUrl;

          const uploadResponse = await imagekit.upload({
            file: file.buffer,
            fileName,
            folder: "/pandels/gallery",
          });
          uploadedImageCache.set(`/pandels/gallery/${fileName}`, uploadResponse.url);
          return uploadResponse.url;
        });

        galleryUrls = await Promise.all(uploadPromises);
      }

      // 💾 Save theme
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
  }
);
/* ======================================================
   ✅ GET ALL THEMES
====================================================== */
router.get("/all", async (req, res) => {
  try {
    const themes = await Theme.find()
      .populate("pandel", "name zone logo address")
      .populate("artists.artist", "name role image")
      .sort({ year: -1 }); // Latest first

    if (!themes.length)
      return res.status(404).json({ message: "No themes found" });

    res.status(200).json(themes);
  } catch (error) {
    console.error("Error fetching all themes:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

/* ======================================================
   ✅ SEARCH THEMES (by title or concept)
   Example: GET /api/theme/search?q=Durga
====================================================== */
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "")
      return res.status(400).json({ message: "Search query missing" });

    const regex = new RegExp(q, "i"); // case-insensitive
    const themes = await Theme.find({
      $or: [{ title: regex }, { concept: regex }],
    })
      .populate("pandel", "name zone logo address")
      .populate("artists.artist", "name role image");

    if (!themes.length)
      return res.status(404).json({ message: "No matching themes found" });

    res.status(200).json(themes);
  } catch (error) {
    console.error("Error searching themes:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

/* ======================================================
   ✅ FILTER THEMES (by year or artist)
   Example: GET /api/theme/filter?year=2024
            GET /api/theme/filter?artist=652b1f3...
====================================================== */
router.get("/filter", async (req, res) => {
  try {
    const { year, artist } = req.query;

    const filter = {};
    if (year) filter.year = parseInt(year);
    if (artist) filter["artists.artist"] = artist;

    if (!year && !artist)
      return res.status(400).json({ message: "Please provide year or artist filter" });

    const themes = await Theme.find(filter)
      .populate("pandel", "name zone logo address")
      .populate("artists.artist", "name role image")
      .sort({ year: -1 });

    if (!themes.length)
      return res.status(404).json({ message: "No themes found with given filters" });

    res.status(200).json(themes);
  } catch (error) {
    console.error("Error filtering themes:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

/* ======================================================
   ✅ UPDATE THEME (with cleanup)
====================================================== */
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

      const { title, concept, year, pandel, artists, youtubeLink, existingGallery } = req.body;

      let mainImageUrl = theme.mainImage;

      // 🖼️ Replace main image
      if (req.files["mainImageFile"]?.[0]) {
        // Delete old image first
        if (theme.mainImage) await deleteImageByUrl(theme.mainImage);

        const file = req.files["mainImageFile"][0];
        const fileName = `${title}-${year}-main.jpg`;

        mainImageUrl =
          (await checkIfImageExists(fileName, "/pandels")) ||
          (await imagekit.upload({
            file: file.buffer,
            fileName,
            folder: "/pandels",
          }).then((r) => {
            uploadedImageCache.set(`/pandels/${fileName}`, r.url);
            return r.url;
          }));
      }

      // 🖼️ Update gallery
      let newGalleryUrls = existingGallery ? JSON.parse(existingGallery) : [];

      if (req.files["galleryFiles"]?.length > 0) {
        // Delete old gallery before uploading new
        for (const oldUrl of theme.gallery) {
          if (!newGalleryUrls.includes(oldUrl)) await deleteImageByUrl(oldUrl);
        }

        const uploadPromises = req.files["galleryFiles"].map(async (file, index) => {
          const fileName = `${title}-${year}-gallery-${index + 1}.jpg`;

          const existingUrl = await checkIfImageExists(fileName, "/pandels/gallery");
          if (existingUrl) return existingUrl;

          const uploadResponse = await imagekit.upload({
            file: file.buffer,
            fileName,
            folder: "/pandels/gallery",
          });
          uploadedImageCache.set(`/pandels/gallery/${fileName}`, uploadResponse.url);
          return uploadResponse.url;
        });

        const uploaded = await Promise.all(uploadPromises);
        newGalleryUrls = [...newGalleryUrls, ...uploaded];
      }

      // 🧾 Update DB fields
      theme.title = title || theme.title;
      theme.concept = concept || theme.concept;
      theme.year = year || theme.year;
      theme.pandel = pandel || theme.pandel;
      theme.mainImage = mainImageUrl;
      theme.gallery = newGalleryUrls;
      theme.youtubeLink = youtubeLink || theme.youtubeLink;
      theme.artists = artists ? JSON.parse(artists) : theme.artists;

      await theme.save();
      res.status(200).json({ message: "Theme updated successfully", theme });
    } catch (error) {
      console.error("Error updating theme:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }
);

/* ======================================================
   ✅ DELETE THEME (cleanup from ImageKit)
====================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const theme = await Theme.findByIdAndDelete(req.params.id);
    if (!theme) return res.status(404).json({ message: "Theme not found" });

    // 🧹 Clean up images
    if (theme.mainImage) await deleteImageByUrl(theme.mainImage);
    if (theme.gallery?.length > 0) {
      await Promise.all(theme.gallery.map((url) => deleteImageByUrl(url)));
    }

    res.status(200).json({ message: "Theme and associated images deleted successfully" });
  } catch (error) {
    console.error("Error deleting theme:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

/* ======================================================
   ✅ GET THEMES by Pandel + Year
====================================================== */
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
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
