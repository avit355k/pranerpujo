const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Pandel = require("../model/pandels");
const { StationPandal, Station } = require("../model/transit");

const ACCESS_MODES = ["walk", "rickshaw", "auto", "bus"];

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const isValidNumber = (value) =>
    typeof value === "number" && Number.isFinite(value);

const populateConnection = (query) => {
    return query
        .populate({
            path: "station",
            populate: {
                path: "line",
                populate: {
                    path: "mode",
                    select: "name key icon color",
                },
            },
        })
        .populate("pandal");
};

// Check whether the station-pandal pair already exists.
const pairExists = async (station, pandal, excludeId = null) => {
    const filter = { station, pandal };

    if (excludeId) {
        filter._id = { $ne: excludeId };
    }

    return StationPandal.exists(filter);
};

// Check whether a sequence number is already used for this station.
const sequenceExists = async (station, sequence, excludeId = null) => {
    const filter = { station, sequence };

    if (excludeId) {
        filter._id = { $ne: excludeId };
    }

    return StationPandal.exists(filter);
};

// Validate access information.
const validateAccess = (access) => {
    if (access === undefined) return null;

    if (!access || typeof access !== "object" || Array.isArray(access)) {
        return "Access must be an object.";
    }

    if (
        access.mode !== undefined &&
        !ACCESS_MODES.includes(access.mode)
    ) {
        return `Access mode must be one of: ${ACCESS_MODES.join(", ")}.`;
    }

    if (
        access.minutes !== undefined &&
        (!Number.isInteger(access.minutes) || access.minutes < 0)
    ) {
        return "Access minutes must be a non-negative integer.";
    }

    return null;
};

// Create a station-pandal connection
router.post("/create", async (req, res) => {
    try {
        const { station, pandal, sequence, distanceFromStationM, access, tips, } = req.body;

        if (!station || !pandal || sequence === undefined) {
            return res.status(400).json({
                success: false,
                message: "Station, pandal and sequence are required.",
            });
        }

        if (!isValidObjectId(station) || !isValidObjectId(pandal)) {
            return res.status(400).json({
                success: false,
                message: "Invalid station or pandal ID.",
            });
        }

        if (!Number.isInteger(sequence) || sequence < 0) {
            return res.status(400).json({
                success: false,
                message: "Sequence must be a non-negative integer.",
            });
        }

        if (
            distanceFromStationM !== undefined &&
            (!isValidNumber(distanceFromStationM) ||
                distanceFromStationM < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Distance must be a non-negative number.",
            });
        }

        const accessError = validateAccess(access);

        if (accessError) {
            return res.status(400).json({
                success: false,
                message: accessError,
            });
        }

        const [stationExists, pandalExists] = await Promise.all([
            Station.exists({ _id: station }),
            Pandel.exists({ _id: pandal }),
        ]);

        if (!stationExists) {
            return res.status(404).json({
                success: false,
                message: "Station not found.",
            });
        }

        if (!pandalExists) {
            return res.status(404).json({
                success: false,
                message: "Pandel not found.",
            });
        }

        if (await pairExists(station, pandal)) {
            return res.status(409).json({
                success: false,
                message: "This pandal is already connected to this station.",
            });
        }

        if (await sequenceExists(station, sequence)) {
            return res.status(409).json({
                success: false,
                message: "This sequence is already used for this station.",
            });
        }

        const connection = await StationPandal.create({
            station,
            pandal,
            sequence,
            distanceFromStationM,
            access,
            tips,
        });

        const result = await populateConnection(
            StationPandal.findById(connection._id)
        );

        return res.status(201).json({
            success: true,
            message: "Station-pandal connection created successfully.",
            data: result,
        });
    } catch (error) {
        console.error("Create StationPandal Error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This connection or sequence already exists.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error while creating station-pandal connection.",
        });
    }
});


// Get all station-pandal connections
// Optional filters: ?station=ID or ?pandal=ID

router.get("/all", async (req, res) => {
    try {
        const { station, pandal } = req.query;
        const filter = {};

        if (station) {
            if (!isValidObjectId(station)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid station ID.",
                });
            }

            filter.station = station;
        }

        if (pandal) {
            if (!isValidObjectId(pandal)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid pandal ID.",
                });
            }

            filter.pandal = pandal;
        }

        const connections = await populateConnection(
            StationPandal.find(filter)
        ).sort({ station: 1, sequence: 1 });

        return res.status(200).json({
            success: true,
            count: connections.length,
            data: connections,
        });
    } catch (error) {
        console.error("Get All StationPandal Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching connections.",
        });
    }
});

// GET /station/:stationId
// Get all pandels connected to one station

router.get("/station/:stationId", async (req, res) => {
    try {
        const { stationId } = req.params;

        if (!isValidObjectId(stationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid station ID.",
            });
        }

        const station = await Station.findById(stationId);

        if (!station) {
            return res.status(404).json({
                success: false,
                message: "Station not found.",
            });
        }

        const connections = await populateConnection(
            StationPandal.find({ station: stationId })
        ).sort({ sequence: 1 });

        return res.status(200).json({
            success: true,
            station,
            count: connections.length,
            data: connections,
        });
    } catch (error) {
        console.error("Get Pandels By Station Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching station pandels.",
        });
    }
});


// GET /pandal/:pandalId
// Get all stations connected to one pandal

router.get("/pandal/:pandalId", async (req, res) => {
    try {
        const { pandalId } = req.params;

        if (!isValidObjectId(pandalId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pandal ID.",
            });
        }

        const pandal = await Pandel.findById(pandalId);

        if (!pandal) {
            return res.status(404).json({
                success: false,
                message: "Pandel not found.",
            });
        }

        const connections = await populateConnection(
            StationPandal.find({ pandal: pandalId })
        ).sort({ sequence: 1 });

        return res.status(200).json({
            success: true,
            pandal,
            count: connections.length,
            data: connections,
        });
    } catch (error) {
        console.error("Get Stations By Pandal Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching pandal stations.",
        });
    }
});


// GET /:id
// Get one station-pandal connections
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid connection ID.",
            });
        }

        const connection = await populateConnection(
            StationPandal.findById(id)
        );

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: "Station-pandal connection not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: connection,
        });
    } catch (error) {
        console.error("Get StationPandal Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching connection.",
        });
    }
});


// PUT /update/:id
// Update a station-pandal connection
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid connection ID.",
            });
        }

        const connection = await StationPandal.findById(id);

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: "Station-pandal connection not found.",
            });
        }

        const {
            station,
            pandal,
            sequence,
            distanceFromStationM,
            access,
            tips,
        } = req.body;

        const updatedStation = station ?? connection.station.toString();
        const updatedPandal = pandal ?? connection.pandal.toString();
        const updatedSequence = sequence ?? connection.sequence;

        if (
            !isValidObjectId(updatedStation) ||
            !isValidObjectId(updatedPandal)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid station or pandal ID.",
            });
        }

        if (
            !Number.isInteger(updatedSequence) ||
            updatedSequence < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Sequence must be a non-negative integer.",
            });
        }

        if (
            distanceFromStationM !== undefined &&
            (!isValidNumber(distanceFromStationM) ||
                distanceFromStationM < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Distance must be a non-negative number.",
            });
        }

        const accessError = validateAccess(access);

        if (accessError) {
            return res.status(400).json({
                success: false,
                message: accessError,
            });
        }

        const [stationExists, pandalExists] = await Promise.all([
            Station.exists({ _id: updatedStation }),
            Pandel.exists({ _id: updatedPandal }),
        ]);

        if (!stationExists) {
            return res.status(404).json({
                success: false,
                message: "Station not found.",
            });
        }

        if (!pandalExists) {
            return res.status(404).json({
                success: false,
                message: "Pandel not found.",
            });
        }

        if (await pairExists(updatedStation, updatedPandal, id)) {
            return res.status(409).json({
                success: false,
                message: "This pandal is already connected to this station.",
            });
        }

        if (
            await sequenceExists(updatedStation, updatedSequence, id)
        ) {
            return res.status(409).json({
                success: false,
                message: "This sequence is already used for this station.",
            });
        }

        connection.station = updatedStation;
        connection.pandal = updatedPandal;
        connection.sequence = updatedSequence;

        if (distanceFromStationM !== undefined) {
            connection.distanceFromStationM = distanceFromStationM;
        }

        if (access !== undefined) {
            connection.access = {
                ...(connection.access?.toObject?.() || connection.access || {}),
                ...access,
            };
        }

        if (tips !== undefined) {
            connection.tips = tips;
        }

        await connection.save();

        const result = await populateConnection(
            StationPandal.findById(id)
        );

        return res.status(200).json({
            success: true,
            message: "Station-pandal connection updated successfully.",
            data: result,
        });
    } catch (error) {
        console.error("Update StationPandal Error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This connection or sequence already exists.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error while updating connection.",
        });
    }
});

// DELETE /delete/:id
// Delete a station-pandal connection only
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid connection ID.",
            });
        }

        const connection = await StationPandal.findByIdAndDelete(id);

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: "Station-pandal connection not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Station-pandal connection deleted successfully.",
        });
    } catch (error) {
        console.error("Delete StationPandal Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting connection.",
        });
    }
});

module.exports = router;
