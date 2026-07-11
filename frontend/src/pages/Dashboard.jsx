import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [resume, setResume] = useState(null)
  const [stats, setStats] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchResume()
    fetchStats()
  }, [])

  const fetchResume = async () => {
    try {
      const response = await axios.get('/api/resume/profile')
      setResume(response.data.resume)
    } catch (err) {
      console.log('No resume yet')
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/applications')
      setStats(response.data.stats)
    } catch (err) {
      console.log('No applications yet')
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only')
      return
    }

    setUploading(true)
    setError('')
    setUploadMessage('')

    const formData = new FormData()
    formData.append('resume', file)

    try {
      const response = await axios.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setUploadMessage('Resume uploaded and analyzed successfully!')
      fetchResume() 
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1419]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="text-[#8B95A3] text-xs uppercase tracking-widest mb-1">
            Welcome back
          </p>
          <h1 className="text-[#FAF7F2] text-2xl font-medium">
            {user?.name}
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-4">
            <p className="text-[#8B95A3] text-xs mb-2">Total Applied</p>
            <p className="text-[#FAF7F2] text-2xl font-mono font-bold">
              {stats?.total || 0}
            </p>
          </div>

          <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-4">
            <p className="text-[#8B95A3] text-xs mb-2">Interviewing</p>
            <p className="text-[#FAC775] text-2xl font-mono font-bold">
              {stats?.interviewing || 0}
            </p>
          </div>

          <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-4">
            <p className="text-[#8B95A3] text-xs mb-2">Rejected</p>
            <p className="text-[#8B95A3] text-2xl font-mono font-bold">
              {stats?.rejected || 0}
            </p>
          </div>

          <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-4">
            <p className="text-[#8B95A3] text-xs mb-2">Shortlist Rate</p>
            <p className="text-[#D4FF4F] text-2xl font-mono font-bold">
              {stats?.shortlistRate || 0}%
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-6">
            <p className="text-[#8B95A3] text-xs uppercase tracking-widest mb-1">
              Resume
            </p>
            <h2 className="text-[#FAF7F2] text-lg font-medium mb-4">
              {resume ? 'Your resume' : 'Upload your resume'}
            </h2>

            {resume ? (
              <div className="mb-4">
                <p className="text-[#8B95A3] text-xs uppercase tracking-wider mb-3">
                  Skills detected
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resume.parsedData?.skills?.slice(0, 8).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-[#10211A] text-[#9FE1CB] text-xs px-3 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                  {resume.parsedData?.skills?.length > 8 && (
                    <span className="text-[#8B95A3] text-xs px-3 py-1">
                      +{resume.parsedData.skills.length - 8} more
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate('/matches')}
                  className="w-full bg-[#D4FF4F] text-[#0F1419] font-medium py-3 rounded-lg text-sm hover:bg-[#c8f545] transition-colors"
                >
                  Find matching jobs
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#2A323C] rounded-xl p-8 text-center mb-4">
                <p className="text-[#FAF7F2] text-sm font-medium mb-1">
                  Drop your resume here
                </p>
                <p className="text-[#8B95A3] text-xs mb-4">PDF only, up to 5MB</p>
                <label className="cursor-pointer bg-transparent border border-[#2A323C] text-[#FAF7F2] text-sm px-4 py-2 rounded-lg hover:border-[#D4FF4F] transition-colors">
                  Browse files
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {resume && (
              <label className="cursor-pointer block text-center text-[#8B95A3] text-xs hover:text-[#FAF7F2] transition-colors mt-2">
                Re-upload resume
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
            {uploading && (
              <div className="mt-4 bg-[#1A2129] rounded-lg p-3">
                <p className="text-[#8B95A3] text-xs text-center">
                  Analyzing your resume with AI, this takes about 10 seconds...
                </p>
              </div>
            )}

            {uploadMessage && (
              <div className="mt-4 bg-[#10211A] border border-[#9FE1CB] rounded-lg p-3">
                <p className="text-[#9FE1CB] text-xs text-center">{uploadMessage}</p>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-[#291712] border border-[#FF6B5E] rounded-lg p-3">
                <p className="text-[#FF6B5E] text-xs text-center">{error}</p>
              </div>
            )}

          </div>

          <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-6">
            <p className="text-[#8B95A3] text-xs uppercase tracking-widest mb-1">
              Quick actions
            </p>
            <h2 className="text-[#FAF7F2] text-lg font-medium mb-6">
              What do you want to do?
            </h2>

            <div className="flex flex-col gap-3">

              <button
                onClick={() => navigate('/matches')}
                className="flex items-center justify-between bg-[#1A2129] border border-[#232B33] rounded-lg px-4 py-4 hover:border-[#D4FF4F] transition-colors group"
              >
                <div className="text-left">
                  <p className="text-[#FAF7F2] text-sm font-medium">Find job matches</p>
                  <p className="text-[#8B95A3] text-xs mt-1">
                    Search real jobs that match your skills
                  </p>
                </div>
                <span className="text-[#8B95A3] group-hover:text-[#D4FF4F] transition-colors">
                  →
                </span>
              </button>

              <button
                onClick={() => navigate('/applications')}
                className="flex items-center justify-between bg-[#1A2129] border border-[#232B33] rounded-lg px-4 py-4 hover:border-[#D4FF4F] transition-colors group"
              >
                <div className="text-left">
                  <p className="text-[#FAF7F2] text-sm font-medium">View applications</p>
                  <p className="text-[#8B95A3] text-xs mt-1">
                    Track your applied jobs and shortlist chances
                  </p>
                </div>
                <span className="text-[#8B95A3] group-hover:text-[#D4FF4F] transition-colors">
                  →
                </span>
              </button>

              <button
                onClick={() => navigate('/ats')}
                className="flex items-center justify-between bg-[#1A2129] border border-[#232B33] rounded-lg px-4 py-4 hover:border-[#D4FF4F] transition-colors group"
              >
                <div className="text-left">
                  <p className="text-[#FAF7F2] text-sm font-medium">ATS keyword check</p>
                  <p className="text-[#8B95A3] text-xs mt-1">
                    Find missing keywords to improve your resume
                  </p>
                </div>
                <span className="text-[#8B95A3] group-hover:text-[#D4FF4F] transition-colors">
                  →
                </span>
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Dashboard