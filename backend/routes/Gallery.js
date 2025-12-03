const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const ImageKit = require("imagekit");

const Gallery = require("../model/gallery");
const Pandel = require("../model/pandels");

// ImageKit configuration
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: Get fileId by URL
async function getFileIdByUrl(url) {
    try {
        const fileName = url.split("/").pop();
        const files = await imagekit.listFiles();
        const file = files.find(f => f.name === fileName);
        return file ? file.fileId : null;
    } catch (err) {
        console.error("Error getting fileId:", err.message);
        return null;
    }
}

// ================= Upload Gallery =================
router.post("/upload", upload.array("photos"), async (req, res) => {
    try {
        const { pandel, year, video } = req.body;

        if (!pandel || !year) {
            return res.status(400).json({ error: "Missing required fields: pandel or year" });
        }

        if (!mongoose.Types.ObjectId.isValid(pandel)) {
            return res.status(400).json({ error: "Invalid Pandel ID" });
        }

        // Upload images as is
        let uploadedPhotoURLs = [];
        if (req.files && req.files.length > 0) {
            uploadedPhotoURLs = await Promise.all(
                req.files.map(async (file) => {
                    try {
                        const uploadResponse = await imagekit.upload({
                            file: file.buffer,
                            fileName: file.originalname,
                            folder: "/pandels",
                            useUniqueFileName: true,
                        });
                        return uploadResponse.url;
                    } catch (err) {
                        console.error("ImageKit upload error:", err.message);
                        return null;
                    }
                })
            );
            uploadedPhotoURLs = uploadedPhotoURLs.filter(url => url);
        }

        const newGallery = new Gallery({
            photos: uploadedPhotoURLs,
            video: video || "",
            pandel,
            year,
        });

        await newGallery.save();
        res.status(201).json({ message: "Gallery uploaded successfully", gallery: newGallery });
    } catch (err) {
        console.error("Upload error:", err.message, err.stack);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ================= Update Gallery =================
router.put("/update/:id", upload.array("newPhotos"), async (req, res) => {
    try {
        const { id } = req.params;
        const { removePhotos, video, year, pandel } = req.body;

        const gallery = await Gallery.findById(id);
        if (!gallery) return res.status(404).json({ error: "Gallery not found" });

        // Delete selected photos
        if (removePhotos) {
            const toRemove = Array.isArray(removePhotos) ? removePhotos : [removePhotos];
            await Promise.all(
                toRemove.map(async (url) => {
                    const fileId = await getFileIdByUrl(url);
                    if (fileId) await imagekit.deleteFile(fileId);
                })
            );
            gallery.photos = gallery.photos.filter(url => !toRemove.includes(url));
        }

        // Upload new photos
        if (req.files && req.files.length > 0) {
            const newPhotoURLs = await Promise.all(
                req.files.map(async (file) => {
                    try {
                        const uploadResponse = await imagekit.upload({
                            file: file.buffer,
                            fileName: file.originalname,
                            folder: "/pandels",
                            useUniqueFileName: true,
                        });
                        return uploadResponse.url;
                    } catch (err) {
                        console.error("ImageKit upload error:", err.message);
                        return null;
                    }
                })
            );
            gallery.photos.push(...newPhotoURLs.filter(url => url));
        }

        // Update other fields
        if (video !== undefined) gallery.video = video;
        if (year) gallery.year = year;
        if (pandel && mongoose.Types.ObjectId.isValid(pandel)) gallery.pandel = pandel;

        await gallery.save();
        res.status(200).json({ message: "Gallery updated successfully", gallery });
    } catch (err) {
        console.error("Update error:", err.message, err.stack);
        res.status(500).json({ error: "Internal server error" });
    }
});
// ================= Get All Galleries =================
router.get("/all", async (req, res) => {
    try {
        const galleries = await Gallery.find()
            .populate("pandel", "name");

        // Sort by populated field pandel.name
        galleries.sort((a, b) => {
            const nameA = a.pandel?.name?.toLowerCase() || "";
            const nameB = b.pandel?.name?.toLowerCase() || "";
            return nameA.localeCompare(nameB);
        });

        res.status(200).json(galleries);
    } catch (err) {
        console.error("Fetch all galleries error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
// ================= Delete Gallery =================
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const gallery = await Gallery.findById(id);
        if (!gallery) return res.status(404).json({ error: "Gallery not found" });

        if (gallery.photos && gallery.photos.length > 0) {
            await Promise.all(
                gallery.photos.map(async (url) => {
                    const fileId = await getFileIdByUrl(url);
                    if (fileId) await imagekit.deleteFile(fileId);
                })
            );
        }

        await Gallery.findByIdAndDelete(id);
        res.status(200).json({ message: "Gallery and images deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err.message, err.stack);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ================= Get Photos by Pandel & Year ================= 
router.get("/photos/:pandelId/:year", async (req, res) => {
    try {
        const { pandelId, year } = req.params;
        if (!mongoose.Types.ObjectId.isValid(pandelId)) {
            return res.status(400).json({ error: "Invalid Pandel ID" });
        }

        const gallery = await Gallery.findOne({ pandel: pandelId, year: parseInt(year) });
        if (!gallery || !gallery.photos.length)
            return res.status(404).json({ error: "No photos found for this pandel and year" });

        res.status(200).json({ photos: gallery.photos });
    } catch (err) {
        console.error("Photo fetch error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ================= Get Video by Pandel & Year =================
router.get("/video/:pandelId/:year", async (req, res) => {
    try {
        const { pandelId, year } = req.params;
        if (!mongoose.Types.ObjectId.isValid(pandelId)) {
            return res.status(400).json({ error: "Invalid Pandel ID" });
        }

        const gallery = await Gallery.findOne({ pandel: pandelId, year: parseInt(year) });
        if (!gallery || !gallery.video)
            return res.status(404).json({ error: "No video found for this pandel and year" });

        res.status(200).json({ video: gallery.video });
    } catch (err) {
        console.error("Video fetch error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
