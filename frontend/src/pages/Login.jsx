import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/auth/login', { email, password })
      login(response.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1419] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#D4FF4F] rounded-lg flex items-center justify-center">
            <span className="text-[#0F1419] font-bold text-sm font-mono">E</span>
          </div>
          <span className="text-[#FAF7F2] text-lg font-medium">ElevAI</span>
        </div>

        <h1 className="text-[#FAF7F2] text-2xl font-medium mb-2">
          Welcome back
        </h1>
        <p className="text-[#8B95A3] text-sm mb-8">
          Please login to see your matched jobs and resume analysis
        </p>

        {error && (
          <div className="bg-[#291712] border border-[#FF6B5E] rounded-lg px-4 py-3 mb-6">
            <p className="text-[#FF6B5E] text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <div className="flex flex-col gap-2">
            <label className="text-[#8B95A3] text-xs uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              required
              className="bg-[#161D24] border border-[#232B33] rounded-lg px-4 py-3 text-[#FAF7F2] text-sm placeholder-[#3A4450] focus:outline-none focus:border-[#D4FF4F] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#8B95A3] text-xs uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-[#161D24] border border-[#232B33] rounded-lg px-4 py-3 text-[#FAF7F2] text-sm placeholder-[#3A4450] focus:outline-none focus:border-[#D4FF4F] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#D4FF4F] text-[#0F1419] font-medium py-3 rounded-lg text-sm mt-2 hover:bg-[#c8f545] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <p className="text-[#8B95A3] text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#D4FF4F] hover:underline">
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login