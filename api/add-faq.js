const dbConnect = require('../utils/db');
const Faq = require('../models/Faq');
const authMiddleware = require('./authMiddleware');

async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    const { guildId, question, answer, embedding } = req.body;

    if (!question || !answer || !guildId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const newFaq = await Faq.create({
      guildId,
      question,
      answer,
      embedding,
      createdBy: req.user.id, // Optionally track creator
    });

    return res.status(201).json(newFaq);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

module.exports = authMiddleware(handler);
