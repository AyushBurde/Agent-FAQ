const mongoose = require('mongoose');
const { requireRole } = require('./authMiddleware');

const MONGO_URI = process.env.MONGO_URI;

// Settings Schema
const SettingsSchema = new mongoose.Schema({
  similarityThreshold: { type: Number, default: 0.85, min: 0.1, max: 1.0 },
  adminNotifications: { type: Boolean, default: true },
  autoSaveUnknown: { type: Boolean, default: true },
  maxUnknownQuestions: { type: Number, default: 100 },
  botResponseDelay: { type: Number, default: 1000, min: 0, max: 10000 },
  enableAnalytics: { type: Boolean, default: true },
  language: { type: String, default: 'en' },
  timezone: { type: String, default: 'UTC' },
  theme: { type: String, default: 'light', enum: ['light', 'dark'] }
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await mongoose.connect(MONGO_URI);
      let settings = await Settings.findOne();
      
      if (!settings) {
        settings = await Settings.create({});
      }
      
      res.status(200).json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  } else if (req.method === 'PUT') {
    try {
      await mongoose.connect(MONGO_URI);
      const updates = req.body;
      
      // Validate similarity threshold
      if (updates.similarityThreshold !== undefined) {
        if (updates.similarityThreshold < 0.1 || updates.similarityThreshold > 1.0) {
          return res.status(400).json({ error: 'Similarity threshold must be between 0.1 and 1.0' });
        }
      }
      
      let settings = await Settings.findOne();
      if (!settings) {
        settings = await Settings.create(updates);
      } else {
        Object.assign(settings, updates);
        await settings.save();
      }
      
      res.status(200).json(settings);
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

module.exports = requireRole('admin')(handler); 