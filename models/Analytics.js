const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  matched: { type: Number, default: 0 },
  unmatched: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema); 