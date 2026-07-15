const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  jobEmbedding: { type: [Number], required: true },
  location: { type: String, default: 'Remote' },
  applyLink: { type: String, default: '' },
  source: { type: String, default: 'Manual' },
  fetchedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Job', jobSchema);