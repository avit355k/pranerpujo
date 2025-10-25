// routes/dashboard.js
const express = require("express");
const Artist = require("../model/artists");
const Pandel = require("../model/pandels");
const Theme = require("../model/theme");

const router = express.Router();

router.get("/counts", async (req, res) => {
  try {
    const [pandals, themes, artists] = await Promise.all([
      Pandel.countDocuments(),
      Theme.countDocuments(),
      Artist.countDocuments(),
    ]);

    res.json({ pandals, themes, artists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch dashboard counts" });
  }
});

module.exports = router;
