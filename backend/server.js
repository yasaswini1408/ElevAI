const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/coverletter', require('./routes/coverLetterRoutes'));

// console.log("RapidAPI:", !!process.env.RAPIDAPI_KEY);
// console.log("Adzuna ID:", !!process.env.ADZUNA_APP_ID);
// console.log("Adzuna Key:", !!process.env.ADZUNA_APP_KEY);

app.get('/', (req, res) => {
  res.json({ message: 'ElevAI server is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ElevAI server is awake' })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});