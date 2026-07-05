const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { generateEmbedding } = require('../utils/embeddingHelper');

const addJob = async (req, res) => {
  try {
    const { title, company, description, requirements, location } = req.body;
    if (!title || !company || !description) {
      return res.status(400).json({ message: 'Please fill title, company and description' });
    }
    console.log('Generating embedding for job...');
    const textForEmbedding = `${title} ${requirements.join(' ')} ${description}`;
    const jobEmbedding = await generateEmbedding(textForEmbedding);

    const job = await Job.create({
      title,
      company,
      description,
      requirements,
      location,
      jobEmbedding
    });

    res.status(201).json({
      message: 'Job added successfully',
      jobId: job._id
    });

  } catch (error) {
    console.log('Add job error:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().select('-jobEmbedding');
    res.status(200).json({ jobs });
  } catch (error) {
    console.log('Get jobs error:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const matchJobs = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    if (!resume.resumeEmbedding || resume.resumeEmbedding.length === 0) {
      return res.status(400).json({ message: 'Resume embedding not found, please re-upload your resume' });
    }
    const matches = await Job.aggregate([
      {
        $vectorSearch: {
          index: 'job_vector_index',
          path: 'jobEmbedding',
          queryVector: resume.resumeEmbedding,
          numCandidates: 100,
          limit: 5
        }
      },
      {
        $addFields: {
          matchScore: { $meta: 'vectorSearchScore' }
        }
      },
      {
        $project: {
          jobEmbedding: 0
        }
      }
    ]);

    const matchesWithPercentage = matches.map(job => ({
      ...job,
      matchPercentage: Math.round(job.matchScore * 100)
    }));

    res.status(200).json({
      message: 'Jobs matched successfully',
      matches: matchesWithPercentage
    });

  } catch (error) {
    console.log('Match jobs error:', error.message);
    res.status(500).json({ message: 'Something went wrong during matching' });
  }
};

module.exports = {addJob,getAllJobs,matchJobs};