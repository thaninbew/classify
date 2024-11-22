const express = require('express');
const { generateDescription } = require('../controllers/openAIController');

const router = express.Router();

router.post('/generate-description', generateDescription);

module.exports = router;
