const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn("⚠️ GEMINI_API_KEY is not set. AI embedding features will be disabled.");
}

async function getEmbedding(text) {
  if (!genAI) {
    console.warn("⚠️ Attempted to generate embedding without GEMINI_API_KEY.");
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('❌ Error generating embedding:', error);
    return null;
  }
}

module.exports = { getEmbedding };