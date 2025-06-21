import dbConnect from '@/lib/dbConnect';
import Faq from '@/models/Faq';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { guildId } = req.query;

    try {
      const faqs = await Faq.find(guildId ? { guildId } : {});
      res.status(200).json({ success: true, data: faqs });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
