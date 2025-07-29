const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new Error('MONGO_URI not found in env!');

let isConnected = false;

const dbConnect = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('✅ MongoDB connected (API route)');
  } catch (error) {
    console.error('MongoDB error:', error);
  }
};

module.exports = dbConnect;
