const mongoose = require('mongoose');

const unknownQuestionSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    index: true
  },
  text: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  },
  count: {
    type: Number,
    default: 1
  },
  userId: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
});

// Avoid model overwrite issues in dev environment
module.exports = mongoose.models.UnknownQuestion || mongoose.model('UnknownQuestion', unknownQuestionSchema);
