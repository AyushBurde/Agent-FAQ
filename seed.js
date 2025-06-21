import mongoose from 'mongoose';
import Faq from '../models/Faq.js'; // Use `.js` for ES modules
import { getEmbedding } from '../backend/embedding.js';

const MONGO_URI = process.env.MONGO_URI;
const guildId = '1377306965872611388';

const faqs = [
  {
    question: "Is coffee provided in the hackathon?",
    answer: "Yes, coffee will be available throughout the event."
  },
  {
    question: "Will there be Wi-Fi at the venue?",
    answer: "Yes, high-speed Wi-Fi will be provided to all participants."
  },
  {
    question: "Are there resting areas at the hackathon?",
    answer: "Yes, there will be designated rest zones with bean bags and beds."
  },
  {
    question: "Are goodies provided in the hackathon?",
    answer: "Yes, participants will receive goodies during the event."
  },
  {
    question: "Will we receive goodies?",
    answer: "Yes, each participant receives a goodie bag."
  }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  try {
    await mongoose.connect(MONGO_URI);
    await Faq.deleteMany({ guildId });

    for (const item of faqs) {
      const embedding = await getEmbedding(item.question);
      await Faq.create({
        guildId,
        question: item.question,
        answer: item.answer,
        embedding
      });
      console.log(`✅ Seeded: ${item.question}`);
    }

    return res.status(200).json({ success: true, message: 'Seeding done' });
  } catch (error) {
    console.error('Error seeding DB:', error);
    return res.status(500).json({ error: 'Seeding failed' });
  } finally {
    mongoose.connection.close();
  }
}
