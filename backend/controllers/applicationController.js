const Application = require('../models/Application');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const { groq } = require('../config/aiConfig');
const { generateShortlistPrompt, generateSkillsGapPrompt } = require('../utils/aiPrompts');

const createApplication = async (req, res) => {
  try {
    const { jobId, matchPercentage } = req.body;
    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }
    const resume = await Resume.findOne({ userId: req.user.id });
    const job = await Job.findById(jobId);

    if (!resume) {
      return res.status(404).json({ message: 'Please upload your resume first' });
    }
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const alreadyApplied = await Application.findOne({
      userId: req.user.id,
      jobId: jobId
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    console.log('Running skills gap analysis for shortlist estimation...');
    const gapPrompt = generateSkillsGapPrompt(
      resume.parsedData.skills,
      job.requirements,
      job.title
    );

    const gapResponse = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: gapPrompt }],
      temperature: 0.1
    });

    let skillsGap = { matched: [], missing: [], extra: [] };
    try {
      const cleanedGap = gapResponse.choices[0].message.content
        .replace(/```json|```/g, '').trim();
      skillsGap = JSON.parse(cleanedGap);
    } catch (e) {
      console.log('Could not parse skills gap:', e.message);
    }

    console.log('Estimating shortlist likelihood...');
    const shortlistPrompt = generateShortlistPrompt(
      matchPercentage || 0,
      skillsGap.missing,
      job.title,
      'Not specified'
    );

    const shortlistResponse = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: shortlistPrompt }],
      temperature: 0.1
    });

    let shortlistResult = { likelihood: 'Medium', reasoning: 'Based on your match score' };
    try {
      const cleanedShortlist = shortlistResponse.choices[0].message.content
        .replace(/```json|```/g, '').trim();
      shortlistResult = JSON.parse(cleanedShortlist);
    } catch (e) {
      console.log('Could not parse shortlist result:', e.message);
    }

    const application = await Application.create({
      userId: req.user.id,
      jobId: jobId,
      resumeId: resume._id,
      status: 'Applied',
      matchScoreAtApply: matchPercentage || 0,
      shortlistLikelihood: {
        label: shortlistResult.likelihood,
        reasoning: shortlistResult.reasoning
      }
    });

    res.status(201).json({
      message: 'Application saved successfully',
      application: application,
      skillsGap: skillsGap,
      shortlistLikelihood: shortlistResult
    });

  } catch (error) {
    console.log('Create application error:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate('jobId', '-jobEmbedding')
      .sort({ appliedDate: -1 });

    const total = applications.length;
    const shortlisted = applications.filter(
      app => app.status === 'Interviewing' || app.status === 'Offer'
    ).length;
    const shortlistRate = total > 0 ? Math.round((shortlisted / total) * 100) : 0;

    res.status(200).json({
      applications: applications,
      stats: {
        total: total,
        interviewing: applications.filter(a => a.status === 'Interviewing').length,
        rejected: applications.filter(a => a.status === 'Rejected').length,
        offers: applications.filter(a => a.status === 'Offer').length,
        shortlistRate: shortlistRate
      }
    });

  } catch (error) {
    console.log('Get applications error:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['Applied', 'Interviewing', 'Rejected', 'Offer'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const application = await Application.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { status: status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json({
      message: 'Status updated successfully',
      application: application
    });
  } catch (error) {
    console.log('Update status error:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {createApplication,getApplications,updateStatus};