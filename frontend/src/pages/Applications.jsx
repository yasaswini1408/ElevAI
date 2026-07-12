import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

const Applications = () => {
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/applications')
      setApplications(response.data.applications)
      setStats(response.data.stats)
    } catch (err) {
      console.log('Error fetching applications:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingId(applicationId)
    try {
      await axios.patch(`/api/applications/${applicationId}/status`, {
        status: newStatus
      })
      setApplications(prev =>
        prev.map(app =>
          app._id === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      )
    } catch (err) {
      console.log('Error updating status:', err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-[#1A2129] text-[#8B95A3]'
      case 'Interviewing':
        return 'bg-[#2A2014] text-[#FAC775]'
      case 'Offer':
        return 'bg-[#10211A] text-[#9FE1CB]'
      case 'Rejected':
        return 'bg-[#1F1416] text-[#F09595]'
      default:
        return 'bg-[#1A2129] text-[#8B95A3]'
    }
  }

  const getLikelihoodStyle = (label) => {
    switch (label) {
      case 'High':
        return { dot: 'bg-[#9FE1CB]', text: 'text-[#9FE1CB]' }
      case 'Medium':
        return { dot: 'bg-[#FAC775]', text: 'text-[#FAC775]' }
      case 'Low':
        return { dot: 'bg-[#F0997B]', text: 'text-[#F0997B]' }
      default:
        return { dot: 'bg-[#8B95A3]', text: 'text-[#8B95A3]' }
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1419]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* heading */}
        <div className="mb-8">
          <p className="text-[#8B95A3] text-xs uppercase tracking-widest mb-1">
            Tracker
          </p>
          <h1 className="text-[#FAF7F2] text-2xl font-medium">
            Your applications
          </h1>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-4">
              <p className="text-[#8B95A3] text-xs mb-2">Total applied</p>
              <p className="text-[#FAF7F2] text-2xl font-mono font-bold">
                {stats.total}
              </p>
            </div>
            <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-4">
              <p className="text-[#8B95A3] text-xs mb-2">Interviewing</p>
              <p className="text-[#FAC775] text-2xl font-mono font-bold">
                {stats.interviewing}
              </p>
            </div>
            <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-4">
              <p className="text-[#8B95A3] text-xs mb-2">Rejected</p>
              <p className="text-[#8B95A3] text-2xl font-mono font-bold">
                {stats.rejected}
              </p>
            </div>
            <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-4">
              <p className="text-[#8B95A3] text-xs mb-2">Shortlist rate</p>
              <p className="text-[#D4FF4F] text-2xl font-mono font-bold">
                {stats.shortlistRate}%
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#D4FF4F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && applications.length === 0 && (
          <div className="bg-[#161D24] border border-[#232B33] rounded-xl p-12 text-center">
            <p className="text-[#FAF7F2] text-sm font-medium mb-2">
              No applications yet
            </p>
            <p className="text-[#8B95A3] text-xs">
              Go to Job Matches and click "Mark as applied" on any job
            </p>
          </div>
        )}

        {!loading && applications.length > 0 && (
          <div className="flex flex-col gap-4">

            <div className="hidden md:grid grid-cols-4 px-4 pb-2">
              <span className="text-[#8B95A3] text-xs uppercase tracking-wider">
                Role
              </span>
              <span className="text-[#8B95A3] text-xs uppercase tracking-wider">
                Status
              </span>
              <span className="text-[#8B95A3] text-xs uppercase tracking-wider">
                Shortlist likelihood
              </span>
              <span className="text-[#8B95A3] text-xs uppercase tracking-wider">
                Applied date
              </span>
            </div>

            {applications.map((app) => {
              const likelihood = getLikelihoodStyle(app.shortlistLikelihood?.label)
              return (
                <div
                  key={app._id}
                  className="bg-[#161D24] border border-[#232B33] rounded-xl p-4 md:p-5"
                >
                  <div className="md:hidden flex flex-col gap-3">
                    <div>
                      <p className="text-[#FAF7F2] text-sm font-medium">
                        {app.jobId?.title || 'Job'}
                      </p>
                      <p className="text-[#8B95A3] text-xs mt-1">
                        {app.jobId?.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-3 py-1 rounded-lg ${getStatusStyle(app.status)}`}>
                        {app.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${likelihood.dot}`}></div>
                        <span className={`text-xs ${likelihood.text}`}>
                          {app.shortlistLikelihood?.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:grid grid-cols-4 items-center">
                    <div>
                      <p className="text-[#FAF7F2] text-sm font-medium">
                        {app.jobId?.title || 'Job'}
                      </p>
                      <p className="text-[#8B95A3] text-xs mt-1">
                        {app.jobId?.company}
                      </p>
                    </div>

                    <div>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                        disabled={updatingId === app._id}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer ${getStatusStyle(app.status)}`}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${likelihood.dot}`}></div>
                        <span className={`text-sm ${likelihood.text}`}>
                          {app.shortlistLikelihood?.label}
                        </span>
                      </div>
                      {app.shortlistLikelihood?.reasoning && (
                        <p className="text-[#8B95A3] text-xs mt-1 line-clamp-1">
                          {app.shortlistLikelihood.reasoning}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-[#8B95A3] text-xs font-mono">
                        {new Date(app.appliedDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-[#8B95A3] text-xs mt-1">
                        Match: {app.matchScoreAtApply}%
                      </p>
                    </div>
                  </div>

                  {app.shortlistLikelihood?.reasoning && (
                    <div className="mt-3 pt-3 border-t border-[#1E252C]">
                      <p className="text-[#8B95A3] text-xs italic">
                        AI note: {app.shortlistLikelihood.reasoning}
                      </p>
                    </div>
                  )}

                </div>
              )
            })}

          </div>
        )}

        <p className="text-[#5F5E5A] text-xs mt-8 text-center">
          Shortlist likelihood % is an AI estimate based on match score and missing
          requirements — not a guarantee.
        </p>

      </div>
    </div>
  )
}

export default Applications