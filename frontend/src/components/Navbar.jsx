import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import Logo from './Logo'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  return (
    <nav className="bg-[#0F1419] border-b border-[#1E252C] px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <div className="flex items-center gap-3">
          <Logo size={36} />
          <div>
            <span style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '-0.3px', color: '#F0F0F5' }}>
              Elev<span style={{ color: '#4A90D9' }}>AI</span>
            </span>
            <p style={{ fontSize: '9px', color: '#6B7280', margin: '0', letterSpacing: '0.05em' }}>
              ELEVATE YOUR CAREER
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/dashboard"
            className="text-[#FAF7F2] text-sm hover:text-[#D4FF4F] transition-colors">
            Dashboard
          </Link>
          <Link to="/matches"
            className="text-[#8B95A3] text-sm hover:text-[#FAF7F2] transition-colors">
            Job Matches
          </Link>
          <Link to="/applications"
            className="text-[#8B95A3] text-sm hover:text-[#FAF7F2] transition-colors">
            Applications
          </Link>
          <Link to="/ats"
            className="text-[#8B95A3] text-sm hover:text-[#FAF7F2] transition-colors">
            ATS Check
          </Link>
          <Link to="/resume"
            className="text-[#8B95A3] text-sm hover:text-[#FAF7F2] transition-colors">
            Resume
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1A2129] border border-[#2A323C] flex items-center justify-center">
              <span className="text-[#8B95A3] text-xs font-medium">
                {getInitials(user?.name)}
              </span>
            </div>
            <span className="text-[#FAF7F2] text-sm hidden md:block">
              {user?.name}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-[#8B95A3] text-sm hover:text-[#FF6B5E] transition-colors"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar