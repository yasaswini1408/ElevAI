const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume, getResume, getATSKeywords } = require('../controllers/resumeController');
const protect = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5*1024*1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/profile', protect, getResume);
router.post('/ats-keywords', protect, getATSKeywords);

module.exports = router;