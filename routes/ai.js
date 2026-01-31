const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticate } = require('../middleware/auth');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// GET /ask?question=...
router.get('/ask', authenticate, async (req, res) => {
  const { question } = req.query;
  if (!question) return res.status(400).json({ error: 'Missing question' });

  try {
    if (!OPENAI_API_KEY) {
      return res.status(503).json({ error: "AI service not configured" });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful FAQ assistant.' },
          { role: 'user', content: question },
        ],
        max_tokens: 256,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const aiAnswer = response.data.choices[0].message.content.trim();
    res.status(200).json({ answer: aiAnswer });
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = router;
