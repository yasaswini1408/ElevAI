const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Interviewing', 'Rejected', 'Offer'],
    default: 'Applied'
  },
  matchScoreAtApply: {
    type: Number,
    default: 0
  },
  shortlistLikelihood: {
    label: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    reasoning: {
      type: String,
      default: ''
    }
  },
  appliedDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Application',applicationSchema);