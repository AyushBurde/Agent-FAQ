const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
  answer: { type: String, default: null },
  answeredBy: { type: String, default: null },
  answeredAt: { type: Date, default: null }
});

module.exports = mongoose.model('Question', questionSchema);
