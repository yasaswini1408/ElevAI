const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { generateEmbedding } = require('../utils/embeddingHelper');
const { fetchJobsFromAllSources } = require('../utils/jobFetcher');

const isFresherFriendly = (job) => {
  const seniorKeywords = [
    'senior', 'sr.', 'lead', 'principal', 'head of',
    'director', 'manager', 'architect', '5+ years',
    '6+ years', '7+ years', '8+ years', '10+ years'
  ]
  const titleAndDesc = `${job.title} ${job.description}`.toLowerCase()
  return !seniorKeywords.some(keyword => titleAndDesc.includes(keyword))
}

const fetchAndMatchJobs = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id })
    if (!resume) {
      return res.status(404).json({ message: 'Please upload your resume first' });
    }
    if (!resume.resumeEmbedding || resume.resumeEmbedding.length === 0) {
      return res.status(400).json({ message: 'Please re-upload your resume' });
    }

    const skills = resume.parsedData.skills || [];
    if (skills.length === 0) {
      return res.status(400).json({ message: 'No skills found in resume' });
    }

    console.log('Starting job fetch for skills:', skills.slice(0, 5));
    const fetchedJobs = await fetchJobsFromAllSources(skills, 'India');

    if (fetchedJobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found right now, try again later' });
    }

    const validJobs = fetchedJobs.filter(job =>
      job.title.length > 2 &&
      job.company.length > 1 &&
      job.description.length > 50
    );
    console.log(`Valid jobs after filtering: ${validJobs.length}`);

    const fresherJobs = validJobs.filter(job => isFresherFriendly(job))
    console.log(`After fresher filter: ${fresherJobs.length} jobs`)

    console.log('Generating embeddings for new jobs...');

    const savedJobs = [];
    for (const jobData of fresherJobs.slice(0, 30)) {
      const exists = await Job.findOne({
        title: jobData.title,
        company: jobData.company
      });

      if (!exists) {
        const textForEmbedding = `${jobData.title} ${jobData.requirements.join(' ')} ${jobData.description}`;
        const jobEmbedding = await generateEmbedding(textForEmbedding);

        const newJob = await Job.create({
          title: jobData.title,
          company: jobData.company,
          description: jobData.description,
          requirements: jobData.requirements,
          location: jobData.location,
          applyLink: jobData.applyLink || '',
          source: jobData.source,
          jobEmbedding: jobEmbedding,
          fetchedBy: [req.user.id]
        });
        savedJobs.push(newJob);
      } else {
        await Job.findByIdAndUpdate(exists._id, {
          $addToSet: { fetchedBy: req.user.id }
        });
      }
    }

    console.log(`Saved ${savedJobs.length} new jobs to database`);


    const matches = await Job.aggregate([
      {
        $vectorSearch: {
          index: 'job_vector_index',
          path: 'jobEmbedding',
          queryVector: resume.resumeEmbedding,
          numCandidates: 100,
          limit: 10
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
      message: 'Jobs fetched and matched successfully',
      totalFetched: fetchedJobs.length,
      newJobsSaved: savedJobs.length,
      matches: matchesWithPercentage
    });

  } catch (error) {
    console.log('Fetch and match error:', error.message);
    res.status(500).json({ message: 'Something went wrong during job fetching' });
  }
};

const addJob = async (req, res) => {
  try {
    const { title, company, description, requirements, location } = req.body;
    if (!title || !company || !description) {
      return res.status(400).json({ message: 'Please fill title, company and description' });
    }
    const textForEmbedding = `${title} ${requirements.join(' ')} ${description}`;
    const jobEmbedding = await generateEmbedding(textForEmbedding);
    const job = await Job.create({
      title, company, description, requirements, location, jobEmbedding
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
    const jobs = await Job.find({ fetchedBy: req.user.id }).select('-jobEmbedding')
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
          limit: 10
        }
      },
      {
        $addFields: {
          matchScore: { $meta: 'vectorSearchScore' }
        }
      },
      {
        $match: {
          fetchedBy: resume.userId
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

module.exports = { fetchAndMatchJobs, addJob, getAllJobs, matchJobs };