const express = require('express');
const router = express.Router();
const { generateCoverLetter } = require('../controllers/coverLetterController');
const protect = require('../middleware/authMiddleware');

router.post('/generate', protect, generateCoverLetter);

module.exports = router;