const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const openAIRoutes = require('./routes/openAIRoutes');
const clusteringRoutes = require('./routes/clusteringRoutes');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

const allowedOrigins = ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/playlists', playlistRoutes);
app.use('/openai', openAIRoutes);
app.use('/clustering', clusteringRoutes);

module.exports = app;