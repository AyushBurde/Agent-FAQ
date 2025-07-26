// api/saveUnknown.js
const mongoose = require('mongoose');
const UnknownQuestion = require('../models/UnknownQuestion.js');
const { requireRole } = require('./authMiddleware');

const MONGO_URI = process.env.MONGO_URI;

module.exports = requireRole('admin')(async function handler(req, res) {
  // Only admins can access this logic
  if (req.method === 'GET') {
    // List all unknown questions
    try {
      await mongoose.connect(MONGO_URI);
      const unknowns = await UnknownQuestion.find({});
      return res.status(200).json({ data: unknowns });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    // Existing POST logic (save or update unknown question)
    try {
      await mongoose.connect(MONGO_URI);
      const { text, guildId, userId, embedding, resolve, id } = req.body;
      if (resolve && id) {
        // Resolve (delete) unknown question by id
        await UnknownQuestion.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Unknown question resolved and deleted' });
      }
      const existing = await UnknownQuestion.findOne({ text, guildId });
      if (existing) {
        existing.count += 1;
        await existing.save();
        return res.status(200).json({ message: 'Updated existing question' });
      }
      await UnknownQuestion.create({ text, guildId, userId, embedding });
      return res.status(201).json({ message: 'Unknown question saved' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).send('Method Not Allowed');
  }
});
