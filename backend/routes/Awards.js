const express = require('express');
const router = express.Router();
const Award = require('../model/awards');
const Pandel = require('../model/pandels');

// ===============================
// 1️⃣  Create New Award
// ===============================
router.post('/', async (req, res) => {
  try {
    const { awardName, logo, winners } = req.body; 

    const newAward = new Award({ awardName, logo, winners });
    await newAward.save();

    res.status(201).json({ message: 'Award created successfully', award: newAward });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create award', details: error.message });
  }
});

// ===============================
// 2️⃣  Get All Awards (with pandel details)
// ===============================
router.get('/', async (req, res) => {
  try {
    const awards = await Award.find().populate('winners.pandels');
    res.json(awards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch awards', details: error.message });
  }
});

// ===============================
// 3️⃣  Get Single Award by ID
// ===============================
router.get('/:id', async (req, res) => {
  try {
    const award = await Award.findById(req.params.id).populate('winners.pandels');
    if (!award) return res.status(404).json({ error: 'Award not found' });
    res.json(award);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch award details', details: error.message });
  }
});

// ===============================
// 4️⃣  Update Award
// ===============================
router.put('/:id', async (req, res) => {
  try {
    const updatedAward = await Award.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate('winners.pandels');

    if (!updatedAward) return res.status(404).json({ error: 'Award not found' });

    res.json({ message: 'Award updated successfully', award: updatedAward });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update award', details: error.message });
  }
});

// ===============================
// 5️⃣  Delete Award
// ===============================
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Award.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Award not found' });
    res.json({ message: 'Award deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete award', details: error.message });
  }
});

// ===============================
// 6️⃣  Add/Update Year-wise Pandel(s)
// ===============================
// Example body:
// {
//   "year": 2024,
//   "pandels": ["6717c9c2b1...", "6717d0f4b2..."]
// }
router.post('/:id/yearwise', async (req, res) => {
  try {
    const { year, pandels } = req.body;
    const award = await Award.findById(req.params.id);
    if (!award) return res.status(404).json({ error: 'Award not found' });

    // Validate pandel IDs
    const validPandels = await Pandel.find({ _id: { $in: pandels } });
    if (validPandels.length !== pandels.length) {
      return res.status(400).json({ error: 'One or more pandel IDs are invalid' });
    }

    // Check if that year already exists
    const existingYear = award.winners.find((y) => y.year === year);

    if (existingYear) {
      // Merge unique pandel IDs
      existingYear.pandels = [...new Set([...existingYear.pandels, ...pandels])];
    } else {
      // Add new year entry
      award.winners.push({ year, pandels });
    }

    await award.save();
    await award.populate('winners.pandels');

    res.json({ message: 'Yearwise pandels updated successfully', award });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update yearwise pandels', details: error.message });
  }
});
// ===============================
//  Get Pandels for a Specific Award and Year
// ===============================
// Example: GET /api/awards/:id/year/2024
router.get('/:id/year/:year', async (req, res) => {
  try {
    const { id, year } = req.params;
    const yearNum = parseInt(year);

    // Find the award with populated pandel details
    const award = await Award.findById(id).populate('winners.pandels');
    if (!award) return res.status(404).json({ error: 'Award not found' });

    // Extract the specific year's winner list
    const yearData = award.winners.find((y) => y.year === yearNum);
    if (!yearData)
      return res.status(404).json({ error: `No winners found for year ${year}` });

    res.json({
      awardName: award.awardName,
      logo: award.logo,
      year: yearNum,
      pandels: yearData.pandels,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch pandels for this award and year',
      details: error.message,
    });
  }
});

// ===============================
// 7️⃣ Update a Specific Winner (Year + Pandels)
// ===============================
router.put("/:awardId/winner/:winnerId", async (req, res) => {
  try {
    const { awardId, winnerId } = req.params;
    const { year, pandels } = req.body;

    const award = await Award.findById(awardId);
    if (!award) return res.status(404).json({ error: "Award not found" });

    const winner = award.winners.id(winnerId);
    if (!winner)
      return res.status(404).json({ error: "Winner entry not found" });

    // Validate pandel IDs
    const validPandels = await Pandel.find({ _id: { $in: pandels } });
    if (validPandels.length !== pandels.length)
      return res.status(400).json({ error: "Invalid pandel ID(s)" });

    // Update fields
    winner.year = year;
    winner.pandels = pandels;

    await award.save();
    await award.populate("winners.pandels");

    res.json({ message: "Winner updated successfully", award });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update winner",
      details: error.message,
    });
  }
});
// ===============================
// 8️⃣ Delete a Specific Winner
// ===============================
router.delete("/:awardId/winner/:winnerId", async (req, res) => {
  try {
    const { awardId, winnerId } = req.params;

    const award = await Award.findById(awardId);
    if (!award) return res.status(404).json({ error: "Award not found" });

    const winner = award.winners.id(winnerId);
    if (!winner)
      return res.status(404).json({ error: "Winner entry not found" });

    winner.deleteOne();

    await award.save();

    res.json({ message: "Winner removed successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete winner",
      details: error.message,
    });
  }
});

module.exports = router;
