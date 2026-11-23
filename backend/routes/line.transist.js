const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { TransitLine, TransitMode, Station } = require("../model/transit");

// HEX color validation
const isValidColor = (color) => {
    return /^#([0-9A-Fa-f]{6})$/.test(color);
};

// Generate slug from name if not provided
const generateSlug = (name) => {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
};

// CREATE TRANSIT LINE
router.post("/create", async (req, res) => {
    try {
        const { name, slug, mode, color, iconOverride, order } = req.body;

        // Required field validation
        if (!name || !mode || !color) {
            return res.status(400).json({
                message: "Name, mode and color are required"
            });
        }
        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "Invalid line name"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(mode)) {
            return res.status(400).json({
                message: "Invalid transit mode ID"
            });
        }

        if (!isValidColor(color)) {
            return res.status(400).json({
                message: "Invalid HEX color format. Example: #2563EB"
            });
        }

        // Check whether transit mode exists
        const existingMode = await TransitMode.findById(mode);

        if (!existingMode) {
            return res.status(404).json({
                message: "Transit mode not found"
            });
        }

        const lineSlug = slug ? generateSlug(slug) : generateSlug(name);

        // Check duplicate slug
        const existingLine = await TransitLine.findOne({
            slug: lineSlug
        });

        if (existingLine) {
            return res.status(409).json({
                message: "A transit line with this slug already exists"
            });
        }

        const transitLine = new TransitLine({
            name: name.trim(),
            slug: lineSlug,
            mode,
            color,
            iconOverride: iconOverride || "",
            order: order ?? 0,
        });
        await transitLine.save();
        // Return populated mode information
        await transitLine.populate("mode");

        return res.status(201).json({
            success: true,
            message: "Transit line created successfully",
            transitLine
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// GET ALL TRANSIT LINES
router.get("/all", async (req, res) => {
    try {
        const { mode } = req.query;

        const filter = {};

        // Optional filter by transit mode ID
        if (mode) {
            if (!mongoose.Types.ObjectId.isValid(mode)) {
                return res.status(400).json({
                    message: "Invalid transit mode ID"
                });
            }

            filter.mode = mode;
        }

        const transitLines = await TransitLine.find(filter)
            .populate("mode", "name key icon color")
            .sort({ mode: 1, order: 1, name: 1 });

        return res.status(200).json({
            success: true,
            count: transitLines.length,
            transitLines
        });
    } catch (error) {
        console.error("Get Transit Lines Error:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// GET SINGLE TRANSIT LINE
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid transit line ID"
            });
        }

        const transitLine = await TransitLine.findById(id)
            .populate("mode", "name key icon color");

        if (!transitLine) {
            return res.status(404).json({
                message: "Transit line not found"
            });
        }

        return res.status(200).json({
            success: true,
            transitLine
        });

    } catch (error) {
        console.error("Get Transit Line Error:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// UPDATE TRANSIT LINE
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { name, slug, mode, color, iconOverride, order } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid transit line ID"
            });
        }

        const transitLine = await TransitLine.findById(id);

        if (!transitLine) {
            return res.status(404).json({
                message: "Transit line not found"
            });
        }

        // Validate name
        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    message: "Invalid line name"
                });
            }

            transitLine.name = name.trim();
        }

        // Validate slug
        if (slug !== undefined) {
            if (typeof slug !== "string" || !slug.trim()) {
                return res.status(400).json({
                    message: "Invalid slug"
                });
            }

            const newSlug = generateSlug(slug);

            const duplicateSlug = await TransitLine.findOne({
                slug: newSlug,
                _id: { $ne: id }
            });

            if (duplicateSlug) {
                return res.status(409).json({
                    message: "This slug is already in use"
                });
            }

            transitLine.slug = newSlug;
        }

        // Validate mode
        if (mode !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(mode)) {
                return res.status(400).json({
                    message: "Invalid transit mode ID"
                });
            }

            const existingMode = await TransitMode.findById(mode);

            if (!existingMode) {
                return res.status(404).json({
                    message: "Transit mode not found"
                });
            }

            transitLine.mode = mode;
        }

        // Validate color
        if (color !== undefined) {
            if (!isValidColor(color)) {
                return res.status(400).json({
                    message: "Invalid HEX color format"
                });
            }

            transitLine.color = color;
        }

        if (iconOverride !== undefined) {
            if (typeof iconOverride !== "string") {
                return res.status(400).json({
                    message: "iconOverride must be a string"
                });
            }

            transitLine.iconOverride = iconOverride;
        }

        if (order !== undefined) {
            if (!Number.isFinite(Number(order))) {
                return res.status(400).json({
                    message: "Order must be a valid number"
                });
            }

            transitLine.order = Number(order);
        }

        await transitLine.save();
        await transitLine.populate("mode", "name key icon color");

        return res.status(200).json({
            success: true,
            message: "Transit line updated successfully",
            transitLine
        });

    } catch (error) {
        console.error("Update Transit Line Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// DELETE TRANSIT LINE
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid transit line ID"
            });
        }

        const transitLine = await TransitLine.findById(id);

        if (!transitLine) {
            return res.status(404).json({
                message: "Transit line not found"
            });
        }

        // Prevent deletion if stations are connected
        const existingStation = await Station.exists({
            line: id
        });

        if (existingStation) {
            return res.status(409).json({
                message: "Cannot delete this line. Stations are connected to it."
            });
        }

        await TransitLine.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Transit line deleted successfully"
        });

    } catch (error) {
        console.error("Delete Transit Line Error:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

module.exports = router;
