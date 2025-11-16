// routes/directionRoutes.js
const express = require("express");
const router = express.Router();
const Pandel = require("../model/pandels");

//  Calculate distance (Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
};

//  Route: Calculate direction and distance
router.get("/route", async (req, res) => {
  try {
    const { startLat, startLng, destId } = req.query;
    const destination = await Pandel.findById(destId);

    if (!destination)
      return res.status(404).json({ message: "Destination not found" });

    const distance = calculateDistance(
      parseFloat(startLat),
      parseFloat(startLng),
      destination.location.latitude,
      destination.location.longitude
    );

    res.json({
      from: { lat: startLat, lng: startLng },
      to: destination.location,
      destination: destination.name,
      distance: `${distance.toFixed(2)} km`,
    });
  } catch (err) {
    res.status(500).json({ message: "Error calculating route", error: err.message });
  }
});

module.exports = router;
