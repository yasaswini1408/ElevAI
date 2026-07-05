const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiVersion: 'v1'
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = { gemini, groq };