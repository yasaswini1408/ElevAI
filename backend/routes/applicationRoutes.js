const express = require('express');
const router = express.Router();

const {
  createApplication,getApplications,updateStatus
} = require('../controllers/applicationController');

const protect = require('../middleware/authMiddleware');

router.post('/', protect, createApplication);
router.get('/', protect, getApplications);
router.patch('/:id/status', protect, updateStatus);

module.exports = router;