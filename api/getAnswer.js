const { connectToDatabase } = require('../../backend/db'); // create a db.js helper
const { getRelevantAnswer } = require('../../backend/similarity'); // your logic

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { question } = req.body;
    await connectToDatabase(); // you need to create this helper

    const answer = await getRelevantAnswer(question);
    res.status(200).json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = handler;
