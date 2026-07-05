const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }
    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;
    if (!rawText || rawText.trim().length < 100) {
      return res.status(400).json({
        message: 'Could not read your PDF. Make sure it is a text-based PDF, not a scanned image.'
      });
    }
    const cleanedText = rawText.replace(/\s+/g, ' ').trim();
    let resume = await Resume.findOne({ userId: req.user.id });

    if (resume) {
      resume.rawText = cleanedText;
      resume.parsedData = { skills: [], experience: [], education: [] };
      resume.resumeEmbedding = [];
      await resume.save();
    } else {
      resume = await Resume.create({
        userId: req.user.id,
        rawText: cleanedText,
        parsedData: { skills: [], experience: [], education: [] },
        resumeEmbedding: []
      });
    }

    res.status(200).json({
      message: 'Resume uploaded successfully',
      resumeId: resume._id,
      textLength: cleanedText.length
    });
  } catch (error) {
    console.log('Resume upload error:', error.message);
    res.status(500).json({ message: 'Something went wrong while reading your PDF' });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: 'No resume found, please upload one' });
    }
    res.status(200).json({ resume });
  } catch (error) {
    console.log('Get resume error:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {uploadResume,getResume};