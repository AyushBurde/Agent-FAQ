const express = require('express');
const router = express.Router();
const UnknownQuestion = require('../models/UnknownQuestion');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate);

// GET /
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    const unknownQuestions = await UnknownQuestion.find().sort({ count: -1 });
    res.json(unknownQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
