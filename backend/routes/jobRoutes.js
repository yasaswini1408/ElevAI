const express = require('express');
const router = express.Router();
const {
  fetchAndMatchJobs,addJob,getAllJobs,matchJobs
} = require('../controllers/jobController');
const protect = require('../middleware/authMiddleware');

router.get('/fetch-and-match', protect, fetchAndMatchJobs);
router.post('/add', protect, addJob);
router.get('/all', protect, getAllJobs);
router.get('/match/:resumeId', protect, matchJobs);

module.exports = router;