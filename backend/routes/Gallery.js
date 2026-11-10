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

// Helper: upload many files to /pandels/gallery, skipping failures
async function uploadPhotos(files) {
    const urls = await Promise.all(
        files.map(async (file) => {
            try {
                const uploadResponse = await imagekit.upload({
                    file: file.buffer,
                    fileName: file.originalname,
                    folder: "/pandels/gallery",
                    useUniqueFileName: true,
                });
                return uploadResponse.url;
            } catch (err) {
                console.error("ImageKit upload error:", err.message);
                return null;
            }
        })
    );
    return urls.filter(Boolean);
}

// Helper: Delete ImageKit file by URL (looks in the exact folder, handles encoded names)
async function deleteImageByUrl(url) {
    try {
        // "/pandels/gallery/file.webp" from the full URL
        const endpoint = process.env.IMAGEKIT_URL_ENDPOINT.replace(/\/$/, "");
        const filePath = decodeURIComponent(url.replace(endpoint, "").split("?")[0]);

        const fileName = filePath.split("/").pop();
        const folder = filePath.substring(0, filePath.lastIndexOf("/")) || "/";

        const files = await imagekit.listFiles({
            path: folder,
            searchQuery: `name="${fileName}"`,
            limit: 1,
        });

        if (files.length > 0) {
            await imagekit.deleteFile(files[0].fileId);
            console.log(`Deleted from ImageKit: ${filePath}`);
        } else {
            console.warn(`File not found in ImageKit: ${filePath}`);
        }
    } catch (err) {
        console.error("Failed to delete image:", url, err.message);
    }
}

// Upload Gallery
router.post("/upload", upload.array("photos"), async (req, res) => {
    try {
        const { pandel, year, video } = req.body;

        if (!pandel || !year) {
            return res.status(400).json({ error: "Missing required fields: pandel or year" });
        }

        if (!mongoose.Types.ObjectId.isValid(pandel)) {
            return res.status(400).json({ error: "Invalid Pandel ID" });
        }

        const uploadedPhotoURLs = req.files?.length > 0 ? await uploadPhotos(req.files) : [];

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

// Get All Galleries
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

// Get Photos by Pandel & YearWisePhotoGallery
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

// Get Video by Pandel & YearWisePhotoGallery
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

//  Update Gallery
router.put("/update/:id", upload.array("newPhotos"), async (req, res) => {
    try {
        const { id } = req.params;
        const { removePhotos, video, year, pandel } = req.body;

        const gallery = await Gallery.findById(id);
        if (!gallery) return res.status(404).json({ error: "Gallery not found" });

        // Remove selected photos from the DB document (ImageKit files deleted after save)
        let toRemove = [];
        if (removePhotos) {
            toRemove = Array.isArray(removePhotos) ? removePhotos : [removePhotos];
            gallery.photos = gallery.photos.filter((url) => !toRemove.includes(url));
        }

        // Upload new photos
        if (req.files?.length > 0) {
            gallery.photos.push(...(await uploadPhotos(req.files)));
        }

        // Update other fields
        if (video !== undefined) gallery.video = video;
        if (year) gallery.year = year;
        if (pandel && mongoose.Types.ObjectId.isValid(pandel)) gallery.pandel = pandel;

        await gallery.save();

        // DB saved, now remove the files from ImageKit
        await Promise.all(toRemove.map((url) => deleteImageByUrl(url)));

        res.status(200).json({ message: "Gallery updated successfully", gallery });
    } catch (err) {
        console.error("Update error:", err.message, err.stack);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete Gallery 
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid Gallery ID" });
        }

        const gallery = await Gallery.findByIdAndDelete(id);
        if (!gallery) return res.status(404).json({ error: "Gallery not found" });

        if (gallery.photos?.length > 0) {
            await Promise.all(gallery.photos.map((url) => deleteImageByUrl(url)));
        }

        res.status(200).json({ message: "Gallery and images deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err.message, err.stack);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
