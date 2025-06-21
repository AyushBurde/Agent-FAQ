import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: false,
  },
});

export default mongoose.models.Faq || mongoose.model('Faq', faqSchema);
