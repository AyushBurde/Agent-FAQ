require('dotenv').config();
const mongoose = require('mongoose');
const Faq = require('./models/Faq'); // no .js extension
const { getEmbedding } = require('./backend/embedding'); // Make sure this is CommonJS too

const MONGO_URI = process.env.MONGO_URI;
const guildId = '1377306965872611388'; // Your real Discord Server ID

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
  { question: "Will we receive goodies?", 
    answer: "Yes, each participant receives a goodie bag." 
  }
  
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await Faq.deleteMany({ guildId }); // clear old entries

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

  } catch (error) {
    console.error('Error seeding DB:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
console.log("✅ Seeded FAQs for guildId:", guildId);
