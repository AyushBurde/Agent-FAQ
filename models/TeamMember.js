const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'moderator', 'user'], default: 'user' },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'invited', 'removed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema); 