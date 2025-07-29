const mongoose = require('mongoose');
const User = require('../models/User.js');
const TeamMember = require('../models/TeamMember.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI;
const INVITE_SECRET = process.env.INVITE_SECRET || 'invite_secret';

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Missing token or password' });

  try {
    const decoded = jwt.verify(token, INVITE_SECRET);
    await mongoose.connect(MONGO_URI);
    const user = await User.findById(decoded.userId);
    if (!user || user.email !== decoded.email) {
      return res.status(400).json({ error: 'Invalid invitation' });
    }
    // Set new password
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    // Update team member status to active
    await TeamMember.findOneAndUpdate({ user: user._id }, { status: 'active' });
    return res.status(200).json({ message: 'Account activated. You can now log in.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = handler; 