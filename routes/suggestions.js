const express = require('express');
const router = express.Router();
const storage = require('../utils/storage');

// Simple suggestions based on unknown questions
router.get('/', async (req, res) => {
  try {
    const unknowns = await storage.getUnknownQuestions();

    // Simple logic: if asked > 1 times, suggest it
    const suggestions = unknowns
      .filter(u => u.count > 1)
      .map(u => ({
        id: u._id,
        question: u.text,
        suggestedAnswer: "Suggested based on frequent requests.",
        confidence: Math.min(u.count * 0.2, 1.0),
        timesAsked: u.count,
        category: 'General',
        priority: u.count > 3 ? 'high' : 'medium'
      }))
      .sort((a, b) => b.timesAsked - a.timesAsked)
      .slice(0, 10);

    res.json({
      suggestions,
      total: suggestions.length
    });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

module.exports = router;
