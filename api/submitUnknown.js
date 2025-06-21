// api/saveUnknown.js
import mongoose from 'mongoose';
import UnknownQuestion from '../models/UnknownQuestion.js';

const MONGO_URI = process.env.MONGO_URI;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    await mongoose.connect(MONGO_URI);

    const { text, guildId, userId, embedding } = req.body;

    const existing = await UnknownQuestion.findOne({ text, guildId });

    if (existing) {
      existing.count += 1;
      await existing.save();
      return res.status(200).json({ message: 'Updated existing question' });
    }

    await UnknownQuestion.create({ text, guildId, userId, embedding });
    return res.status(201).json({ message: 'Unknown question saved' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
