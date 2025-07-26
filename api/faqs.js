const dbConnect = require('../utils/db');
const Faq = require('../models/Faq');
const { requireRole } = require('./authMiddleware');

async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { guildId } = req.query;

    try {
      const faqs = await Faq.find(guildId ? { guildId } : {});
      res.status(200).json({ success: true, data: faqs });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'PUT') {
    // Update FAQ by ID
    await dbConnect();
    const { id } = req.query;
    const { question, answer, embedding } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing FAQ id' });
    }
    try {
      const updated = await Faq.findByIdAndUpdate(
        id,
        { question, answer, embedding },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, error: 'FAQ not found' });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'DELETE') {
    // Delete FAQ by ID
    await dbConnect();
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing FAQ id' });
    }
    try {
      const deleted = await Faq.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'FAQ not found' });
      }
      res.status(200).json({ success: true, data: deleted });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

const putAndDeleteHandler = requireRole('admin')(handler);

module.exports = async function mainHandler(req, res) {
  if (req.method === 'PUT' || req.method === 'DELETE') {
    return putAndDeleteHandler(req, res);
  }
  return handler(req, res);
}
