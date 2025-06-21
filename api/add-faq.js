import dbConnect from '../utils/db';
import Faq from '../models/Faq';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    const { guildId, question, answer, embedding } = req.body;

    if (!question || !answer || !guildId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const newFaq = await Faq.create({
      guildId,
      question,
      answer,
      embedding,
    });

    return res.status(201).json(newFaq);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
