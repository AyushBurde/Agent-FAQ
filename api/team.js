const mongoose = require('mongoose');
const TeamMember = require('../models/TeamMember.js');
const User = require('../models/User.js');
const { requireRole } = require('./authMiddleware');
const { sendEmail } = require('../utils/sendEmail.js');
const jwt = require('jsonwebtoken');

const MONGO_URI = process.env.MONGO_URI;
const INVITE_SECRET = process.env.INVITE_SECRET || 'invite_secret';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

async function handler(req, res) {
  await mongoose.connect(MONGO_URI);

  if (req.method === 'GET') {
    // List all team members
    const members = await TeamMember.find({}).populate('user invitedBy', 'username email role');
    return res.status(200).json({ members });
  } else if (req.method === 'POST') {
    // Invite/add a team member
    const { email, role } = req.body;
    if (!email || !role) return res.status(400).json({ error: 'Missing fields' });
    let user = await User.findOne({ email });
    if (!user) {
      // Optionally, create a user with invited status
      user = await User.create({ email, username: email, password: Math.random().toString(36).slice(-8), role });
    }
    const member = await TeamMember.create({ user: user._id, role, invitedBy: req.user.id, status: 'invited' });
    // Generate invitation token (JWT)
    const token = jwt.sign({ userId: user._id, email: user.email }, INVITE_SECRET, { expiresIn: '3d' });
    const inviteLink = `${APP_URL}/accept-invite?token=${token}`;
    // Send invitation email
    await sendEmail({
      to: user.email,
      subject: 'You are invited to join the FAQ Agent Team',
      html: `<p>You have been invited to join the FAQ Agent Team as <b>${role}</b>.<br>
      Click <a href="${inviteLink}">here</a> to accept your invitation and set your password.<br>
      This link will expire in 3 days.</p>`
    });
    return res.status(201).json({ member, inviteLink });
  } else if (req.method === 'PUT') {
    // Update a team member's role/status
    const { id, role, status } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing member id' });
    const member = await TeamMember.findByIdAndUpdate(id, { role, status }, { new: true });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    return res.status(200).json({ member });
  } else if (req.method === 'DELETE') {
    // Remove a team member
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing member id' });
    const member = await TeamMember.findByIdAndDelete(id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    return res.status(200).json({ message: 'Member removed' });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

module.exports = requireRole('admin')(handler); 