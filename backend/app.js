const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const openAIRoutes = require('./routes/openAIRoutes');
const clusteringRoutes = require('./routes/clusteringRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/playlists', playlistRoutes);
app.use('/openai', openAIRoutes);
app.use('/clustering', clusteringRoutes);

module.exports = app;