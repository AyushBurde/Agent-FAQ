const express = require('express');
const router = express.Router();
const storage = require('../utils/storage');

// GET /
router.get('/', async (req, res) => {
  try {
    const settings = await storage.getSettings();
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /
router.put('/', async (req, res) => {
  try {
    const updates = req.body;
    const settings = await storage.updateSettings(updates);
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
