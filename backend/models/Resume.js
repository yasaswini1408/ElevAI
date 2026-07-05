const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rawText: {
    type: String,
    required: true
  },
  parsedData: {
    skills: [String],
    experience: [Object],
    education: [Object]
  },
  resumeEmbedding: {
    type: [Number],
    default: []
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume',resumeSchema);