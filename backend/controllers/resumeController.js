const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const { groq } = require('../config/aiConfig');
const { generateParsingPrompt } = require('../utils/aiPrompts');
const { generateEmbedding } = require('../utils/embeddingHelper');

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
    console.log('Sending resume to Groq for parsing...');
    const prompt = generateParsingPrompt(cleanedText);

    const aiResponse = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1
    });

    const aiText = aiResponse.choices[0].message.content;

    let parsedData;
    try {
      const cleanedAiText = aiText.replace(/```json|```/g, '').trim();
      parsedData = JSON.parse(cleanedAiText);
    } catch (parseError) {
      console.log('Could not parse AI response:', parseError.message);
      parsedData = { skills: [], experience: [], education: [] };
    }

    console.log('Generating embedding for resume...');
    const textForEmbedding = `${parsedData.skills.join(' ')} ${cleanedText}`;
    const resumeEmbedding = await generateEmbedding(textForEmbedding);

    let resume = await Resume.findOne({ userId: req.user.id });
    if (resume) {
      resume.rawText = cleanedText;
      resume.parsedData = parsedData;
      resume.resumeEmbedding = resumeEmbedding;
      await resume.save();
    } else {
      resume = await Resume.create({
        userId: req.user.id,
        rawText: cleanedText,
        parsedData: parsedData,
        resumeEmbedding: resumeEmbedding
      });
    }

    res.status(200).json({
      message: 'Resume uploaded, parsed and embedded successfully',
      resumeId: resume._id,
      parsedData: parsedData,
      embeddingDimensions: resumeEmbedding.length
    });

  } catch (error) {
    console.log('Resume upload error:', error.message);
    res.status(500).json({ message: 'Something went wrong while processing your resume' });
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