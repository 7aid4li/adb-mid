// Main entry point for the API server.
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postcardRoutes = require('./routes/postcards');
const countryRoutes = require('./routes/countries');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// --- Database Connection ---
const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// --- API Routes ---
// Use the imported route files.
// For example, any URL starting with /api/auth will be handled by authRoutes.
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/postcards', postcardRoutes);
app.use('/api/countries', countryRoutes);

// --- Start Server ---
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
