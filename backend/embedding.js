const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(' Please set GEMINI_API_KEY in your .env file');
}

const genAI = new GoogleGenerativeAI(apiKey);

async function getEmbedding(text) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-exp-03-07' });

    const result = await model.embedContent({
      content: {
        parts: [{ text }],
      },
      taskType: 'SEMANTIC_SIMILARITY',
    });

    return result.embedding.values;
  } catch (error) {
    console.error('❌ Error generating embedding:', error);
    return null;
  }
}

module.exports = { getEmbedding };