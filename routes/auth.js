const express = require('express');
const router = express.Router();

// Auth is disabled in this version
router.post('/login', (req, res) => {
  res.json({ token: 'dummy_token', user: { name: 'Admin', email: 'admin@local' } });
});

module.exports = router;
