const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Station, TransitLine, StationPandal } = require("../model/transit");

// HEX color validation (empty string is allowed for inheritance)
const isValidColor = (color) => {
    return color === "" || /^#([0-9A-Fa-f]{6})$/.test(color);
};

// Validate location according to Station schema
const parseLocation = (location) => {
    if (!location || typeof location !== "object") return null;

    const { latitude, longitude } = location;

    // Reject null, empty strings and booleans
    if (
        latitude === null || latitude === "" || typeof latitude === "boolean" ||
        longitude === null || longitude === "" || typeof longitude === "boolean"
    ) return null;

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
        !Number.isFinite(lat) || !Number.isFinite(lng) ||
        lat < -90 || lat > 90 ||
        lng < -180 || lng > 180
    ) return null;

    return { latitude: lat, longitude: lng };
};

const LOCATION_ERROR = "Invalid location. Use { latitude, longitude }";

// Duplicate (line, sequence) from the unique index
const handleDuplicateKey = (error, res) => {
    if (error.code === 11000) {
        res.status(409).json({
            message: "A station with this sequence already exists on this line"
        });
        return true;
    }

    return false;
};

// Populate complete station hierarchy
const populateStation = (query) => {
    return query.populate({
        path: "line",
        populate: {
            path: "mode",
            select: "name key icon color"
        }
    });
};

// CREATE STATION
router.post("/create", async (req, res) => {
    try {
        const { name, code, line, location, sequence, transitTip, colorOverride, iconOverride } = req.body;

        if (!name || !line || !location || sequence === undefined) {
            return res.status(400).json({
                message: "Name, line, location and sequence are required"
            });
        }

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "Invalid station name"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(line)) {
            return res.status(400).json({
                message: "Invalid transit line ID"
            });
        }

        // Validate location according to model
        const parsedLocation = parseLocation(location);

        if (!parsedLocation) {
            return res.status(400).json({
                message: LOCATION_ERROR
            });
        }

        if (
            !Number.isInteger(Number(sequence)) ||
            Number(sequence) < 0
        ) {
            return res.status(400).json({
                message: "Sequence must be a non-negative integer"
            });
        }

        if (
            colorOverride !== undefined &&
            !isValidColor(colorOverride)
        ) {
            return res.status(400).json({
                message: "Invalid station color. Use HEX format like #2563EB"
            });
        }

        if (
            iconOverride !== undefined &&
            typeof iconOverride !== "string"
        ) {
            return res.status(400).json({
                message: "Icon override must be a string"
            });
        }

        // Verify transit line
        const existingLine = await TransitLine.findById(line);

        if (!existingLine) {
            return res.status(404).json({
                message: "Transit line not found"
            });
        }

        const station = new Station({
            name: name.trim(),
            code: typeof code === "string"
                ? code.trim().toUpperCase()
                : undefined,
            line,
            location: parsedLocation,
            sequence: Number(sequence),
            transitTip: transitTip || "",
            colorOverride: colorOverride || "",
            iconOverride: iconOverride || ""
        });

        await station.save();

        const populatedStation = await populateStation(
            Station.findById(station._id)
        );

        return res.status(201).json({
            success: true,
            message: "Station created successfully",
            station: populatedStation
        });

    } catch (error) {
        console.error(error);

        if (handleDuplicateKey(error, res)) return;

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// GET ALL STATIONS

router.get("/all", async (req, res) => {
    try {
        const { line, mode } = req.query;

        const filter = {};

        if (line) {
            if (!mongoose.Types.ObjectId.isValid(line)) {
                return res.status(400).json({
                    message: "Invalid transit line ID"
                });
            }

            filter.line = line;
        }

        if (mode) {
            if (!mongoose.Types.ObjectId.isValid(mode)) {
                return res.status(400).json({
                    message: "Invalid transit mode ID"
                });
            }

            const lines = await TransitLine.find({ mode }).select("_id");

            filter.line = {
                $in: lines.map(item => item._id)
            };
        }

        const stations = await populateStation(
            Station.find(filter)
        ).sort({ sequence: 1, name: 1 });

        return res.status(200).json({
            success: true,
            count: stations.length,
            stations
        });

    } catch (error) {
        console.error("Get Stations Error:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// GET STATIONS BY TRANSIT LINE
router.get("/line/:lineId", async (req, res) => {
    try {
        const { lineId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(lineId)) {
            return res.status(400).json({
                message: "Invalid transit line ID"
            });
        }

        const existingLine = await TransitLine.findById(lineId)
            .populate("mode", "name key icon color");

        if (!existingLine) {
            return res.status(404).json({
                message: "Transit line not found"
            });
        }

        const stations = await Station.find({ line: lineId })
            .sort({ sequence: 1 })
            .populate({
                path: "line",
                populate: {
                    path: "mode",
                    select: "name key icon color"
                }
            });

        return res.status(200).json({
            success: true,
            line: existingLine,
            count: stations.length,
            stations
        });

    } catch (error) {
        console.error("Get Line Stations Error:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// FIND NEARBY STATIONS

router.get("/nearby", async (req, res) => {
    try {
        const { lat, lng, maxDistance = 5000 } = req.query;

        const latitude = Number(lat);
        const longitude = Number(lng);
        const distance = Number(maxDistance);

        if (
            lat === undefined ||
            lng === undefined ||
            lat === "" ||
            lng === "" ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            return res.status(400).json({
                message: "Valid latitude and longitude are required"
            });
        }

        if (
            !Number.isFinite(distance) ||
            distance <= 0 ||
            distance > 50000
        ) {
            return res.status(400).json({
                message: "maxDistance must be between 1 and 50000 meters"
            });
        }

        const stations = await populateStation(
            Station.find({})
        );

        // Convert degrees to radians
        const toRadians = (value) => value * Math.PI / 180;

        // Haversine distance calculation (meters)
        const calculateDistance = (station) => {
            const stationLat = station.location.latitude;
            const stationLng = station.location.longitude;

            const dLat = toRadians(stationLat - latitude);
            const dLng = toRadians(stationLng - longitude);

            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRadians(latitude)) *
                Math.cos(toRadians(stationLat)) *
                Math.sin(dLng / 2) ** 2;

            return 6371000 * 2 * Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );
        };

        const nearbyStations = stations
            .map(station => ({
                ...station.toObject(),
                distance: calculateDistance(station)
            }))
            .filter(station => station.distance <= distance)
            .sort((a, b) => a.distance - b.distance);

        return res.status(200).json({
            success: true,
            count: nearbyStations.length,
            stations: nearbyStations
        });

    } catch (error) {
        console.error("Nearby Stations Error:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// GET SINGLE STATION
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid station ID"
            });
        }

        const station = await populateStation(
            Station.findById(id)
        );

        if (!station) {
            return res.status(404).json({
                message: "Station not found"
            });
        }

        return res.status(200).json({
            success: true,
            station
        });

    } catch (error) {
        console.error("Get Station Error:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// UPDATE STATION
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            code,
            line,
            location,
            sequence,
            transitTip,
            colorOverride,
            iconOverride
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid station ID"
            });
        }

        const station = await Station.findById(id);

        if (!station) {
            return res.status(404).json({
                message: "Station not found"
            });
        }

        // Update name
        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    message: "Invalid station name"
                });
            }

            station.name = name.trim();
        }

        // Update station code
        if (code !== undefined) {
            if (typeof code !== "string") {
                return res.status(400).json({
                    message: "Invalid station code"
                });
            }

            station.code = code.trim().toUpperCase();
        }

        // Update transit line
        if (line !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(line)) {
                return res.status(400).json({
                    message: "Invalid transit line ID"
                });
            }

            const existingLine = await TransitLine.findById(line);

            if (!existingLine) {
                return res.status(404).json({
                    message: "Transit line not found"
                });
            }

            station.line = line;
        }

        // Update location according to Station schema
        if (location !== undefined) {
            const parsedLocation = parseLocation(location);

            if (!parsedLocation) {
                return res.status(400).json({
                    message: LOCATION_ERROR
                });
            }

            station.location = parsedLocation;
        }

        // Update sequence
        if (sequence !== undefined) {
            if (
                !Number.isInteger(Number(sequence)) ||
                Number(sequence) < 0
            ) {
                return res.status(400).json({
                    message: "Invalid station sequence"
                });
            }

            station.sequence = Number(sequence);
        }

        if (transitTip !== undefined) {
            station.transitTip = transitTip;
        }

        // Empty color means inherit line color
        if (colorOverride !== undefined) {
            if (!isValidColor(colorOverride)) {
                return res.status(400).json({
                    message: "Invalid HEX color format"
                });
            }

            station.colorOverride = colorOverride;
        }

        // Empty icon means inherit line/mode icon
        if (iconOverride !== undefined) {
            if (typeof iconOverride !== "string") {
                return res.status(400).json({
                    message: "Invalid icon override"
                });
            }

            station.iconOverride = iconOverride;
        }

        await station.save();

        const updatedStation = await populateStation(
            Station.findById(station._id)
        );

        return res.status(200).json({
            success: true,
            message: "Station updated successfully",
            station: updatedStation
        });

    } catch (error) {
        console.error("Update Station Error:", error);

        if (handleDuplicateKey(error, res)) return;

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// DELETE STATION
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid station ID"
            });
        }

        const station = await Station.findById(id);

        if (!station) {
            return res.status(404).json({
                message: "Station not found"
            });
        }

        // Prevent deletion if pandal connections exist
        const existingConnections = await StationPandal.exists({
            station: id
        });

        if (existingConnections) {
            return res.status(409).json({
                message: "Cannot delete this station. Pandal connections exist."
            });
        }

        await Station.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Station deleted successfully"
        });

    } catch (error) {
        console.error("Delete Station Error:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

module.exports = router;
