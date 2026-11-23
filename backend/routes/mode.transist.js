const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const { TransitMode,TransitLine } = require('../model/transit');

// Hex color validation
const isValidColor = (color) => {
    return /^#([0-9A-Fa-f]{6})$/.test(color);
};

//CREATE TRANSIT MODE
router.post("/create", async (req, res) => {
    try {
        const { name, key, icon, color, order } = req.body;

        if (!name || !key || !icon || !color) {
            return res.status(400).json({
                message: "Name, key, icon and color are required"
            });
        }
        if (!["metro", "train"].includes(key)) {
            return res.status(400).json({
                message: "Invalid transit mode key"
            });
        }
        if (!isValidColor(color)) {
            return res.status(400).json({
                message: "Invalid color format. Use HEX format like #DC2626"
            });
        }

        const existingMode = await TransitMode.findOne({ key });

        if (existingMode) {
            return res.status(409).json({
                message: "Transit mode already exists"
            });
        }

        const transitMode = new TransitMode({
            name: name.trim(),
            key,
            icon,
            color,
            order
        });

        await transitMode.save();

        return res.status(201).json({ message: "Transist mode added successfully", transitMode });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

//  GET ALL TRANSIT MODES
router.get("/all", async (req, res) => {
    try {
        const transitModes = await TransitMode.find()
            .sort({ order: 1, createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: transitModes.length,
            transitModes
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// GET SINGLE TRANSIT MODE
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid transit mode ID"
            });
        }

        const transitMode = await TransitMode.findById(id);

        if (!transitMode) {
            return res.status(404).json({
                message: "Transit mode not found"
            });
        }

        return res.status(200).json({
            success: true,
            transitMode
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// UPDATE TRANSIT MODE
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, key, icon, color, order } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid transit mode ID"
            });
        }

        const transitMode = await TransitMode.findById(id);

        if (!transitMode) {
            return res.status(404).json({
                message: "Transit mode not found"
            });
        }

        if (key !== undefined && !["metro", "train"].includes(key)) {
            return res.status(400).json({
                message: "Invalid transit mode key"
            });
        }

        if (color !== undefined && !isValidColor(color)) {
            return res.status(400).json({
                message: "Invalid HEX color format"
            });
        }

        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    message: "Name cannot be empty"
                });
            }
            transitMode.name = name.trim();
        }

        if (key !== undefined) transitMode.key = key;
        if (icon !== undefined) transitMode.icon = icon;
        if (color !== undefined) transitMode.color = color;
        if (order !== undefined) transitMode.order = order;

        await transitMode.save();

        return res.status(200).json({
            message: "Transit mode updated successfully",
            transitMode
        });

    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "This transit mode key already exists"
            });
        }

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});


// DELETE TRANSIT MODE
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid transit mode ID"
            });
        }

        const transitMode = await TransitMode.findById(id);

        if (!transitMode) {
            return res.status(404).json({
                message: "Transit mode not found"
            });
        }

        // Prevent deletion if lines are connected
        const existingLines = await TransitLine.exists({
            mode: id
        });

        if (existingLines) {
            return res.status(409).json({
                message: "Cannot delete this mode. Transit lines are connected to it."
            });
        }

        await TransitMode.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Transit mode deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

module.exports = router;
