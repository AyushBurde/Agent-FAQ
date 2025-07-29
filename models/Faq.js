const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: false,
  },
});

module.exports = mongoose.models.Faq || mongoose.model('Faq', faqSchema);
