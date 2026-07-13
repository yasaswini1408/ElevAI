# ElevAI — Elevate Your Career

ElevAI is a full-stack AI-powered job matching platform that semantically matches resumes to real job listings using vector embeddings and MongoDB Atlas Vector Search.

🔗 **Live Demo:** https://elevai-ruby.vercel.app  

---

## What I built

- 📄 **AI Resume Parser** — Upload your PDF, Groq's Llama 3.1 extracts your skills, experience and education automatically
- 🎯 **Semantic Job Matching** — Your resume is converted into a 384-dimensional vector and matched against real jobs using MongoDB Atlas Vector Search and cosine similarity
- 🌐 **Real Job Fetching** — Fetches live job openings from JSearch, Adzuna and RemoteOK simultaneously and deduplicates them
- 📊 **Skills Gap Analysis** — Shows exactly which skills you're missing for each job
- 🔍 **ATS Keyword Check** — Finds phrases ATS systems scan for that are missing from your resume
- 📈 **Shortlist Likelihood** — AI estimates your chances of getting shortlisted based on match score and missing requirements
- ✉️ **Cover Letter Generator** — Generates a personalized cover letter for each job using your actual resume experience
- 📋 **Application Tracker** — Track every job you apply to with status updates and shortlist rate

---

## Tech Stack

- **Frontend** — React.js, Vite, Tailwind CSS
- **Backend** — Node.js, Express.js
- **Database** — MongoDB Atlas with Vector Search
- **AI Generation** — Groq API (Llama 3.1 8B)
- **AI Embeddings** — Xenova Transformers running locally in Node.js
- **Auth** — JWT in HTTP-only cookies + bcryptjs
- **Job APIs** — JSearch (RapidAPI), Adzuna, RemoteOK
- **Deployment** — Vercel + Render

---

## Built by

**Yasaswini Samala** 

If you find this project useful or interesting, please consider giving it a ⭐ star on GitHub — it means a lot!
