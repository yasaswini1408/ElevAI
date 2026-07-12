import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

const Resume = () => {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchResume()
  }, [])

  const fetchResume = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/resume/profile')
      setResume(response.data.resume)
    } catch (err) {
      console.log('No resume yet')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only')
      return
    }

    setUploading(true)
    setMessage('')
    setError('')

    const formData = new FormData()
    formData.append('resume', file)

    try {
      await axios.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage('Resume updated successfully!')
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

      <div className="max-w-3xl mx-auto px-6 py-8">

        <div className="mb-8">
          <p className="text-[#8B95A3] text-xs uppercase tracking-widest mb-1">
            Resume central
          </p>
          <h1 className="text-[#FAF7F2] text-2xl font-medium">
            Your resume
          </h1>
        </div>

        <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-6 mb-6">
          <p className="text-[#FAF7F2] text-sm font-medium mb-1">
            {resume ? 'Update your resume' : 'Upload your resume'}
          </p>
          <p className="text-[#8B95A3] text-xs mb-4">
            PDF only, up to 5MB. We extract text directly — scanned PDFs won't work.
          </p>

          <label className="cursor-pointer block">
            <div className="border-2 border-dashed border-[#2A323C] rounded-xl p-8 text-center hover:border-[#D4FF4F] transition-colors">
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-[#D4FF4F] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#8B95A3] text-sm">
                    Analyzing with AI, takes about 10 seconds...
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[#FAF7F2] text-sm font-medium mb-1">
                    Drop PDF here or click to browse
                  </p>
                  <p className="text-[#8B95A3] text-xs">PDF only, max 5MB</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>

          {message && (
            <div className="mt-4 bg-[#10211A] border border-[#9FE1CB] rounded-lg p-3">
              <p className="text-[#9FE1CB] text-xs text-center">{message}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-[#291712] border border-[#FF6B5E] rounded-lg p-3">
              <p className="text-[#FF6B5E] text-xs text-center">{error}</p>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-[#D4FF4F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && resume && (
          <div className="flex flex-col gap-5">

            <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-5">
              <p className="text-[#8B95A3] text-xs uppercase tracking-wider mb-3">
                Skills detected — {resume.parsedData?.skills?.length || 0} total
              </p>
              <div className="flex flex-wrap gap-2">
                {resume.parsedData?.skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-[#10211A] text-[#9FE1CB] text-xs px-3 py-1.5 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {resume.parsedData?.experience?.length > 0 && (
              <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-5">
                <p className="text-[#8B95A3] text-xs uppercase tracking-wider mb-4">
                  Experience
                </p>
                <div className="flex flex-col gap-4">
                  {resume.parsedData.experience.map((exp, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#D4FF4F] mt-1.5 flex-shrink:0"></div>
                      <div>
                        <p className="text-[#FAF7F2] text-sm font-medium">
                          {exp.role}
                        </p>
                        <p className="text-[#8B95A3] text-xs mt-0.5">
                          {exp.company} · {exp.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resume.parsedData?.education?.length > 0 && (
              <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-5">
                <p className="text-[#8B95A3] text-xs uppercase tracking-wider mb-4">
                  Education
                </p>
                <div className="flex flex-col gap-4">
                  {resume.parsedData.education.map((edu, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#D4FF4F] mt-1.5 flex-shrink:0"></div>
                      <div>
                        <p className="text-[#FAF7F2] text-sm font-medium">
                          {edu.degree}
                        </p>
                        <p className="text-[#8B95A3] text-xs mt-0.5">
                          {edu.institution}
                          {edu.score && ` · ${edu.score} CGPA`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[#5F5E5A] text-xs text-center">
              Last updated:{' '}
              {new Date(resume.uploadedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>

          </div>
        )}

        {!loading && !resume && (
          <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-12 text-center">
            <p className="text-[#FAF7F2] text-sm font-medium mb-2">
              No resume uploaded yet
            </p>
            <p className="text-[#8B95A3] text-xs">
              Upload your PDF above to get started
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Resume