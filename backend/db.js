const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

export const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI);
};
