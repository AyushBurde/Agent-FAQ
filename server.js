const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB error", err));

// Import models
const Faq = require('./models/Faq');
const UnknownQuestion = require('./models/UnknownQuestion');
const Analytics = require('./models/Analytics');

// Import API handlers
const settingsHandler = require('./api/settings');
const suggestionsHandler = require('./api/suggestions');

// API Routes
app.get('/api/analytics', async (req, res) => {
  try {
    const totalFaqs = await Faq.countDocuments();
    const totalUnknown = await UnknownQuestion.countDocuments();
    const analytics = await Analytics.findOne();
    const matched = analytics?.matched || 0;
    const unmatched = analytics?.unmatched || 0;
    const total = matched + unmatched;
    const accuracy = total > 0 ? ((matched / total) * 100).toFixed(2) : null;
    
    // Get questions that are being tracked (asked 1-2 times)
    const pendingQuestions = await UnknownQuestion.find().sort({ count: -1 }).limit(10);
    
    res.json({ 
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/faqs', async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/faqs', async (req, res) => {
  try {
    const { question, answer, guildId = 'default' } = req.body;
    
    // Generate embedding for the question
    const { getEmbedding } = require('./backend/embedding');
    const embedding = await getEmbedding(question);
    
    const newFaq = new Faq({
      question,
      answer,
      guildId,
      embedding
    });
    
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/faqs/:id', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const { getEmbedding } = require('./backend/embedding');
    const embedding = await getEmbedding(question);
    
    const updatedFaq = await Faq.findByIdAndUpdate(
      req.params.id,
      { question, answer, embedding },
      { new: true }
    );
    
    res.json(updatedFaq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/faqs/:id', async (req, res) => {
  try {
    await Faq.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/unknown-questions', async (req, res) => {
  try {
    const unknownQuestions = await UnknownQuestion.find().sort({ count: -1 });
    res.json(unknownQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Settings routes
app.get('/api/settings', (req, res) => settingsHandler(req, res));
app.put('/api/settings', (req, res) => settingsHandler(req, res));

// Suggestions routes
app.get('/api/suggestions', (req, res) => suggestionsHandler(req, res));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FAQ Bot API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
}); 