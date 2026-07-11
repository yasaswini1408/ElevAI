import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

const JobMatches = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [coverLetterLoading, setCoverLetterLoading] = useState(false)
  const [applyLoading, setApplyLoading] = useState(false)
  const [applyMessage, setApplyMessage] = useState('')

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get('/api/jobs/fetch-and-match')
      setMatches(response.data.matches)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch job matches')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCoverLetter = async (jobId) => {
    setCoverLetterLoading(true)
    setCoverLetter('')
    try {
      const response = await axios.post('/api/coverletter/generate', { jobId })
      setCoverLetter(response.data.coverLetter)
    } catch (err) {
      setCoverLetter('Could not generate cover letter, please try again')
    } finally {
      setCoverLetterLoading(false)
    }
  }

  const handleApply = async (jobId, matchPercentage) => {
    setApplyLoading(true)
    setApplyMessage('')
    try {
      await axios.post('/api/applications', { jobId, matchPercentage })
      setApplyMessage('Application saved successfully!')
    } catch (err) {
      setApplyMessage(err.response?.data?.message || 'Could not save application')
    } finally {
      setApplyLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-[#D4FF4F]'
    if (score >= 50) return 'text-[#FAC775]'
    return 'text-[#FF6B5E]'
  }

  const getScoreBg = (score) => {
    if (score >= 75) return 'bg-[#1F2A1A]'
    if (score >= 50) return 'bg-[#2A2014]'
    return 'bg-[#291712]'
  }

  return (
    <div className="min-h-screen bg-[#0F1419]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#8B95A3] text-xs uppercase tracking-widest mb-1">
              AI powered
            </p>
            <h1 className="text-[#FAF7F2] text-2xl font-medium">
              Job matches
            </h1>
          </div>
          <button
            onClick={fetchMatches}
            disabled={loading}
            className="bg-[#161D24] border border-[#232B33] text-[#FAF7F2] text-sm px-4 py-2 rounded-lg hover:border-[#D4FF4F] transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Refresh matches'}
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#D4FF4F] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#8B95A3] text-sm">
              Searching real jobs across the internet...
            </p>
            <p className="text-[#8B95A3] text-xs mt-2">
              This takes about 25-30 seconds
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-[#291712] border border-[#FF6B5E] rounded-xl p-6 text-center">
            <p className="text-[#FF6B5E] text-sm mb-3">{error}</p>
            <p className="text-[#8B95A3] text-xs">
              Make sure you have uploaded your resume first
            </p>
          </div>
        )}

        {!loading && matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="flex flex-col gap-3">
              <p className="text-[#8B95A3] text-xs uppercase tracking-wider mb-2">
                {matches.length} matches found
              </p>
              {matches.map((job) => (
                <div
                  key={job._id}
                  onClick={() => {
                    setSelectedJob(job)
                    setCoverLetter('')
                    setApplyMessage('')
                  }}
                  className={`bg-[#161D24] border rounded-xl p-4 cursor-pointer transition-colors ${
                    selectedJob?._id === job._id
                      ? 'border-[#D4FF4F]'
                      : 'border-[#232B33] hover:border-[#2A323C]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[#FAF7F2] text-sm font-medium truncate">
                        {job.title}
                      </p>
                      <p className="text-[#8B95A3] text-xs mt-1">
                        {job.company} · {job.location}
                      </p>
                      <span className="inline-block mt-2 text-[#8B95A3] text-xs bg-[#1A2129] px-2 py-0.5 rounded">
                        via {job.source || 'Manual'}
                      </span>
                    </div>
                    <div className={`${getScoreBg(job.matchPercentage)} px-3 py-1 rounded-lg flex-shrink-0`}>
                      <span className={`font-mono text-sm font-bold ${getScoreColor(job.matchPercentage)}`}>
                        {job.matchPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              {selectedJob ? (
                <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-6 sticky top-6">

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-[#FAF7F2] text-lg font-medium">
                        {selectedJob.title}
                      </h2>
                      <p className="text-[#8B95A3] text-sm mt-1">
                        {selectedJob.company} · {selectedJob.location}
                      </p>
                    </div>
                    <div className={`${getScoreBg(selectedJob.matchPercentage)} px-3 py-2 rounded-lg`}>
                      <p className={`font-mono text-lg font-bold ${getScoreColor(selectedJob.matchPercentage)}`}>
                        {selectedJob.matchPercentage}%
                      </p>
                      <p className="text-[#8B95A3] text-xs text-center">match</p>
                    </div>
                  </div>

                  {selectedJob.requirements?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[#8B95A3] text-xs uppercase tracking-wider mb-2">
                        Requirements
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.requirements.map((req, i) => (
                          <span
                            key={i}
                            className="bg-[#1A2129] text-[#8B95A3] text-xs px-3 py-1 rounded-md"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <p className="text-[#8B95A3] text-xs uppercase tracking-wider mb-2">
                      Description
                    </p>
                    <p className="text-[#C5CAD2] text-sm leading-relaxed line-clamp-4">
                      {selectedJob.description}
                    </p>
                  </div>

                  {applyMessage && (
                    <div className={`rounded-lg p-3 mb-4 ${
                      applyMessage.includes('success')
                        ? 'bg-[#10211A] border border-[#9FE1CB]'
                        : 'bg-[#291712] border border-[#FF6B5E]'
                    }`}>
                      <p className={`text-xs text-center ${
                        applyMessage.includes('success')
                          ? 'text-[#9FE1CB]'
                          : 'text-[#FF6B5E]'
                      }`}>
                        {applyMessage}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleApply(selectedJob._id, selectedJob.matchPercentage)}
                      disabled={applyLoading}
                      className="w-full bg-[#D4FF4F] text-[#0F1419] font-medium py-3 rounded-lg text-sm hover:bg-[#c8f545] transition-colors disabled:opacity-50"
                    >
                      {applyLoading ? 'Saving...' : 'Mark as applied'}
                    </button>

                    <button
                      onClick={() => handleGenerateCoverLetter(selectedJob._id)}
                      disabled={coverLetterLoading}
                      className="w-full bg-transparent border border-[#232B33] text-[#FAF7F2] font-medium py-3 rounded-lg text-sm hover:border-[#D4FF4F] transition-colors disabled:opacity-50"
                    >
                      {coverLetterLoading ? 'Generating...' : 'Generate cover letter'}
                    </button>

                    {selectedJob.applyLink && (
                      <a
                        href={selectedJob.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center bg-transparent border border-[#232B33] text-[#8B95A3] py-3 rounded-lg text-sm hover:border-[#D4FF4F] hover:text-[#FAF7F2] transition-colors"
                      >
                        Apply on job site →
                      </a>
                    )}
                  </div>

                  {coverLetter && (
                    <div className="mt-6 border-t border-[#232B33] pt-6">
                      <p className="text-[#8B95A3] text-xs uppercase tracking-wider mb-3">
                        Generated cover letter
                      </p>
                      <div className="bg-[#1A2129] rounded-lg p-4">
                        <p className="text-[#C5CAD2] text-xs leading-relaxed whitespace-pre-line">
                          {coverLetter}
                        </p>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(coverLetter)}
                        className="mt-3 text-[#D4FF4F] text-xs hover:underline"
                      >
                        Copy 
                      </button>
                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-12 flex items-center justify-center">
                  <p className="text-[#8B95A3] text-sm text-center">
                    Click a job on the left to see details
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default JobMatches