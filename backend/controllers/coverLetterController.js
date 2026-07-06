const Resume = require('../models/Resume');
const Job = require('../models/Job');
const { groq } = require('../config/aiConfig');
const { generateCoverLetterPrompt } = require('../utils/aiPrompts');

const generateCoverLetter = async (req, res) => {
  try {
    const { jobId } = req.body;
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
    console.log('Generating cover letter with Groq...');
    const prompt = generateCoverLetterPrompt(
      resume.parsedData,job.title,job.company,job.description
    );

    const aiResponse = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7  
    });
    const coverLetter = aiResponse.choices[0].message.content;
    console.log('Cover letter generated successfully');
    res.status(200).json({
      message: 'Cover letter generated successfully',
      jobTitle: job.title,
      company: job.company,
      coverLetter: coverLetter
    });

  } catch (error) {
    console.log('Cover letter error:', error.message);
    res.status(500).json({ message: 'Something went wrong while generating cover letter' });
  }
};

module.exports = {generateCoverLetter};