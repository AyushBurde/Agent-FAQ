import dbConnect from '../utils/db';
import Faq from '../models/Faq';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await dbConnect();
    const faqs = await Faq.find({});
    return res.status(200).json(faqs);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
