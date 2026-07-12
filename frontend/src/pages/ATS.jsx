import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

const ATS = () => {
  const [mode, setMode] = useState('general')
  const [jobs, setJobs] = useState([])
  const [selectedJobId, setSelectedJobId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs/all')
      setJobs(response.data.jobs)
    } catch (err) {
      console.log('Could not fetch jobs:', err.message)
    }
  }

  const handleCheck = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const body = mode === 'per-job' && selectedJobId
        ? { jobId: selectedJobId }
        : {}

      const response = await axios.post('/api/resume/ats-keywords', body)
      setResult(response.data.atsResult)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const getCoverageColor = (percentage) => {
    if (percentage >= 75) return 'text-[#D4FF4F]'
    if (percentage >= 50) return 'text-[#FAC775]'
    return 'text-[#FF6B5E]'
  }

  return (
    <div className="min-h-screen bg-[#0F1419]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8">

        <div className="mb-8">
          <p className="text-[#8B95A3] text-xs uppercase tracking-widest mb-1">
            Resume optimizer
          </p>
          <h1 className="text-[#FAF7F2] text-2xl font-medium">
            ATS keyword check
          </h1>
          <p className="text-[#8B95A3] text-sm mt-2">
            Find keywords missing from your resume that ATS systems look for
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              setMode('general')
              setResult(null)
            }}
            className={`text-sm px-4 py-2 rounded-lg transition-colors ${
              mode === 'general'
                ? 'bg-[#1F2A1A] border border-[#2F4A1F] text-[#D4FF4F]'
                : 'bg-[#161D24] border border-[#232B33] text-[#8B95A3]'
            }`}
          >
            General check
          </button>
          <button
            onClick={() => {
              setMode('per-job')
              setResult(null)
            }}
            className={`text-sm px-4 py-2 rounded-lg transition-colors ${
              mode === 'per-job'
                ? 'bg-[#1F2A1A] border border-[#2F4A1F] text-[#D4FF4F]'
                : 'bg-[#161D24] border border-[#232B33] text-[#8B95A3]'
            }`}
          >
            Per job check
          </button>
        </div>

        {mode === 'per-job' && (
          <div className="mb-6">
            <label className="text-[#8B95A3] text-xs uppercase tracking-wider block mb-2">
              Select a job
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full bg-[#161D24] border border-[#232B33] rounded-lg px-4 py-3 text-[#FAF7F2] text-sm focus:outline-none focus:border-[#D4FF4F] transition-colors"
            >
              <option value="">Choose a job...</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>
                  {job.title} — {job.company}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleCheck}
          disabled={loading || (mode === 'per-job' && !selectedJobId)}
          className="w-full bg-[#D4FF4F] text-[#0F1419] font-medium py-3 rounded-lg text-sm hover:bg-[#c8f545] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-8"
        >
          {loading ? 'Analyzing your resume...' : 'Run ATS check'}
        </button>

        {error && (
          <div className="bg-[#291712] border border-[#FF6B5E] rounded-xl p-4 mb-6">
            <p className="text-[#FF6B5E] text-sm">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-[#D4FF4F] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#8B95A3] text-sm">
              AI is analyzing your resume keywords...
            </p>
          </div>
        )}

        {result && !loading && (
          <div className="flex flex-col gap-6">

            <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-[#FAF7F2] text-sm font-medium">
                  ATS keyword coverage
                </p>
                <p className="text-[#8B95A3] text-xs mt-1">
                  How well your resume matches common ATS patterns
                </p>
              </div>
              <p className={`font-mono text-3xl font-bold ${getCoverageColor(result.coveragePercentage)}`}>
                {result.coveragePercentage}%
              </p>
            </div>

            <div>
              <p className="text-[#8B95A3] text-xs uppercase tracking-wider mb-3">
                Keywords to add — {result.missingKeywords?.length || 0} found
              </p>

              <div className="flex flex-col gap-3">
                {result.missingKeywords?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#161D24] border border-[#232B33] rounded-xl p-4 flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <p className="text-[#FAF7F2] text-sm font-medium mb-1">
                        {item.keyword}
                      </p>
                      <p className="text-[#8B95A3] text-xs leading-relaxed">
                        {item.reason}
                      </p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(item.keyword)}
                      className="text-[#D4FF4F] text-xs border border-[#2F4A1F] px-3 py-1 rounded-lg hover:bg-[#1F2A1A] transition-colors flex-shrink:0"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1A2129] rounded-xl p-4">
              <p className="text-[#8B95A3] text-xs leading-relaxed">
                💡 <strong className="text-[#FAF7F2]">Tip:</strong> Add these
                keywords naturally into your resume's skills section, project
                descriptions, or summary. Don't just list them — use them in
                context so the resume still reads naturally to humans.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default ATS