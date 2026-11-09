const express = require("express");
const router = express.Router();
const multer = require("multer");
const ImageKit = require("imagekit");

const Theme = require("../model/theme");
const Pandel = require("../model/pandels");
const Artist = require("../model/artists");

// ImageKit configuration
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// In-memory cache
const uploadedImageCache = new Map();
const storage = multer.memoryStorage();
const upload = multer({ storage });

//get file extension 
const getExtension = (filename) => filename.split(".").pop();
// sanitize title for use in file names
const safeName = (s) => String(s).replace(/[^a-zA-Z0-9_-]/g, "_");

async function uploadImage(file, fileName, folder) {
  const response = await imagekit.upload({
    file: file.buffer,
    fileName,
    folder,
  });
  return response.url;
}

// Helper: Check if an image exists in ImageKit
async function checkIfImageExists(fileName, folder = "/pandels") {
  const cacheKey = `${folder}/${fileName}`;
  if (uploadedImageCache.has(cacheKey)) return uploadedImageCache.get(cacheKey);

  try {
    const files = await imagekit.listFiles({
      path: folder,
      searchQuery: `name="${fileName}"`,
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

// Helper: Delete ImageKit file by URL
async function deleteImageByUrl(url) {
  try {
    // Strip the endpoint, query string, and decode: gives "/pandels/gallery/file.webp"
    const endpoint = process.env.IMAGEKIT_URL_ENDPOINT.replace(/\/$/, "");
    const filePath = decodeURIComponent(
      url.replace(endpoint, "").split("?")[0]
    );

    const fileName = filePath.split("/").pop();
    const folder = filePath.substring(0, filePath.lastIndexOf("/")) || "/";

    const files = await imagekit.listFiles({
      path: folder,
      searchQuery: `name="${fileName}"`,
      limit: 1,
    });

    if (files.length > 0) {
      await imagekit.deleteFile(files[0].fileId);
      uploadedImageCache.delete(`${folder}/${fileName}`); // keep cache in sync
      console.log(`Deleted from ImageKit: ${filePath}`);
    } else {
      console.warn(`File not found in ImageKit: ${filePath}`);
    }
  } catch (err) {
    console.error(" Failed to delete image:", err.message);
  }
}

//create theme
router.post("/create",
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

      //  Upload main image
      let mainImageUrl = null;
      if (req.files["mainImageFile"]?.[0]) {
        const file = req.files["mainImageFile"][0];
        const ext = getExtension(file.originalname);
        const fileName = `${safeName(title)}-${numericYear}-main.${ext}`;

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

      //  Upload gallery images (parallel)
      let galleryUrls = [];
      if (req.files["galleryFiles"]?.length > 0) {
        const uploadPromises = req.files["galleryFiles"].map(async (file, index) => {
          const ext = getExtension(file.originalname);
          const fileName = `${safeName(title)}-${numericYear}-gallery-${index + 1}.${ext}`;

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

      //  Save theme
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

//get all themes
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

/* SEARCH THEMES (by title or concept)
   Example: GET /api/theme/search?q=Durga
 */
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

/* FILTER THEMES (by year or artist)
   Example: GET /api/theme/filter?year=2024
            GET /api/theme/filter?artist=652b1f3...*/
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

// GET THEMES by Pandel + Year
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

//update theme
router.put("/:id",
  upload.fields([
    { name: "mainImageFile", maxCount: 1 },
    { name: "galleryFiles", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const theme = await Theme.findById(req.params.id);
      if (!theme) return res.status(404).json({ message: "Theme not found" });

      const { title, concept, year, pandel, artists, youtubeLink, existingGallery } = req.body;

      const finalTitle = title || theme.title;
      const finalYear = year ? parseInt(year) : theme.year;

      // Old files are collected here and deleted only AFTER the DB save succeeds
      const urlsToDelete = [];

      // ---- Main image ----
      let mainImageUrl = theme.mainImage;
      if (req.files?.["mainImageFile"]?.[0]) {
        const file = req.files["mainImageFile"][0];
        const ext = getExtension(file.originalname);
        const fileName = `${safeName(finalTitle)}-${finalYear}-main.${ext}`;

        mainImageUrl = await uploadImage(file, fileName, "/pandels"); // upload new first
        if (theme.mainImage) urlsToDelete.push(theme.mainImage); // then retire the old one
      }

      // ---- Gallery ----
      // existingGallery = JSON array of old URLs the user chose to KEEP.
      // If it is not sent at all, keep everything that is already saved.
      const keptGallery =
        existingGallery !== undefined ? JSON.parse(existingGallery) : [...theme.gallery];

      // Old images that are no longer kept get deleted (even if no new files were uploaded)
      for (const oldUrl of theme.gallery) {
        if (!keptGallery.includes(oldUrl)) urlsToDelete.push(oldUrl);
      }

      let newGalleryUrls = [...keptGallery];
      if (req.files?.["galleryFiles"]?.length > 0) {
        const startIndex = keptGallery.length;
        const uploaded = await Promise.all(
          req.files["galleryFiles"].map((file, index) => {
            const ext = getExtension(file.originalname);
            const fileName = `${safeName(finalTitle)}-${finalYear}-gallery-${startIndex + index + 1}.${ext}`;
            return uploadImage(file, fileName, "/pandels/gallery");
          })
        );
        newGalleryUrls = [...keptGallery, ...uploaded];
      }

      // ---- Update DB fields ----
      theme.title = finalTitle;
      theme.concept = concept || theme.concept;
      theme.year = finalYear;
      theme.pandel = pandel || theme.pandel;
      theme.mainImage = mainImageUrl;
      theme.gallery = newGalleryUrls;
      theme.youtubeLink = youtubeLink || theme.youtubeLink;
      theme.artists = artists ? JSON.parse(artists) : theme.artists;

      await theme.save();

      // DB is saved, now it is safe to remove the replaced/removed images
      await Promise.all(urlsToDelete.map((url) => deleteImageByUrl(url)));

      res.status(200).json({ message: "Theme updated successfully", theme });
    } catch (error) {
      console.error("Error updating theme:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }
);

// Delete Theme
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

module.exports = router;
