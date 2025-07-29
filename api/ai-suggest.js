const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { question } = req.query;
  if (!question) return res.status(400).json({ error: 'Missing question' });

  try {
    // Example using OpenAI API (GPT-3.5/4)
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful FAQ assistant.' },
          { role: 'user', content: question },
        ],
        max_tokens: 256,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const aiAnswer = response.data.choices[0].message.content.trim();
    res.status(200).json({ answer: aiAnswer });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
}

module.exports = handler; 