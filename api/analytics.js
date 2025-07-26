const Faq = require('../models/Faq.js');
const UnknownQuestion = require('../models/UnknownQuestion.js');
const Analytics = require('../models/Analytics.js');
const { requireRole } = require('./authMiddleware');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  await mongoose.connect(MONGO_URI);
  const totalFaqs = await Faq.countDocuments();
  const totalUnknown = await UnknownQuestion.countDocuments();
  const analytics = await Analytics.findOne();
  const matched = analytics?.matched || 0;
  const unmatched = analytics?.unmatched || 0;
  const total = matched + unmatched;
  const accuracy = total > 0 ? ((matched / total) * 100).toFixed(2) : null;
  
  // Get questions that are being tracked (asked 1-2 times)
  const pendingQuestions = await UnknownQuestion.find().sort({ count: -1 }).limit(10);
  
  res.status(200).json({ 
    totalFaqs, 
    totalUnknown, 
    matched, 
    unmatched, 
    accuracy,
    pendingQuestions: pendingQuestions.map(q => ({
      question: q.text,
      count: q.count,
      guildId: q.guildId
    })),
    system: {
      description: "Analytics only count questions after they've been asked 3 times and answered/skipped",
      matchedDescription: "Questions asked 3+ times and answered by admin",
      unmatchedDescription: "Questions asked 3+ times but skipped by admin"
    }
  });
}

module.exports = requireRole('admin')(handler); 