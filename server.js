const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const routes = require('./routes/index');
const authRoutes = require('./routes/auth'); // Auth routes might be separate or part of index

// Connect to MongoDB - REMOVED for file-based storage
// mongoose.connect(...) 
console.log("✅ Using Local JSON Storage (Data/ folder)");


// Use Routes
app.use('/api', routes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});
