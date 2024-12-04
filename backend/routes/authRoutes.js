const express = require('express');
const { login, callback, refreshToken, logout, validateAuth } = require('../controllers/authController');

const router = express.Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/refresh_token', refreshToken);
router.get('/logout', logout);
router.get('/validate', validateAuth);

module.exports = router;
