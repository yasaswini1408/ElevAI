import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

const FeatureIcon = ({ icon }) => (
  <div style={{ width: '48px', height: '48px', background: '#1A2B10', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
    <i className={`ti ${icon}`} style={{ fontSize: '24px', color: '#B8FF3F' }} aria-hidden="true"></i>
  </div>
)

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', fontFamily: 'Inter, -apple-system, sans-serif', color: '#F0F0F5', overflowX: 'hidden' }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 60px', borderBottom: '1px solid #1A1A2A' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Logo size={38} />
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '-0.3px', color: '#F0F0F5', lineHeight: '1.2' }}>
              Elev<span style={{ color: '#4A90D9' }}>AI</span>
            </div>
            <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '0.06em' }}>
              ELEVATE YOUR CAREER
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '36px', fontSize: '14px', color: '#6B7280' }}>
          <a href="#features" style={{ color: '#6B7280', textDecoration: 'none', cursor: 'pointer' }}>Features</a>
          <a href="#howitworks" style={{ color: '#6B7280', textDecoration: 'none', cursor: 'pointer' }}>How it works</a>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'transparent', border: '1px solid #2D2D3A', color: '#9CA3AF', fontSize: '14px', padding: '10px 22px', borderRadius: '9px', cursor: 'pointer' }}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{ background: '#B8FF3F', border: 'none', color: '#0A0A0F', fontSize: '14px', fontWeight: '700', padding: '10px 24px', borderRadius: '9px', cursor: 'pointer' }}
          >
            Get started free
          </button>
        </div>
      </nav>

      <div style={{ padding: '90px 60px 70px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', maxWidth: '1300px', margin: '0 auto' }}>

        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#13131F', border: '1px solid #2D2D3A', padding: '7px 16px', borderRadius: '20px', marginBottom: '32px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#B8FF3F' }}></div>
            <span style={{ fontSize: '12px', color: '#9CA3AF', letterSpacing: '0.06em' }}>LIVE JOB MATCHING ACROSS THE INTERNET</span>
          </div>

          <h1 style={{ fontSize: '58px', fontWeight: '700', lineHeight: '1.08', letterSpacing: '-2px', margin: '0 0 26px' }}>
            Stop applying<br />
            to the<br />
            <span style={{ color: '#B8FF3F' }}>wrong jobs.</span>
          </h1>

          <p style={{ fontSize: '17px', color: '#6B7280', lineHeight: '1.8', margin: '0 0 36px', maxWidth: '420px' }}>
            Upload your resume once. ElevAI finds real openings across JSearch, Adzuna and RemoteOK — ranked by how well they actually match your skills using AI.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '48px' }}>
            <button
              onClick={() => navigate('/register')}
              style={{ background: '#B8FF3F', border: 'none', color: '#0A0A0F', fontSize: '16px', fontWeight: '700', padding: '16px 34px', borderRadius: '11px', cursor: 'pointer' }}
            >
              Upload resume →
            </button>
            <span style={{ fontSize: '14px', color: '#4B5563' }}>Free — no credit card needed</span>
          </div>

          <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: 'monospace', fontSize: '28px', fontWeight: '700', color: '#B8FF3F', margin: '0' }}>3+</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '5px 0 0' }}>Job APIs</p>
            </div>
            <div style={{ width: '1px', height: '40px', background: '#2D2D3A' }}></div>
            <div>
              <p style={{ fontFamily: 'monospace', fontSize: '28px', fontWeight: '700', color: '#F0F0F5', margin: '0' }}>AI</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '5px 0 0' }}>Semantic matching</p>
            </div>
            <div style={{ width: '1px', height: '40px', background: '#2D2D3A' }}></div>
            <div>
              <p style={{ fontFamily: 'monospace', fontSize: '28px', fontWeight: '700', color: '#F0F0F5', margin: '0' }}>100%</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '5px 0 0' }}>Free to use</p>
            </div>
          </div>
        </div>

        <div>
          <div style={{ background: '#13131F', border: '1px solid #2D2D3A', borderRadius: '18px', padding: '24px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Resume analysis</span>
              <span style={{ background: '#1A2B10', color: '#B8FF3F', fontSize: '11px', padding: '4px 12px', borderRadius: '12px', fontWeight: '600' }}>Complete ✓</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {['Node.js', 'React', 'MongoDB', 'Python', 'C++', 'JavaScript', '+14 more'].map((skill, i) => (
                <span key={i} style={{ background: '#1A1A2E', color: '#9CA3AF', fontSize: '12px', padding: '5px 12px', borderRadius: '7px' }}>
                  {skill}
                </span>
              ))}
            </div>
            <div style={{ background: '#0A0A0F', borderRadius: '9px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#6B7280' }}>AI parsed your resume</span>
              <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#B8FF3F', fontWeight: '600' }}>Skills extracted ✓</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { title: 'Backend Engineer', company: 'Razorpay · IN', score: 87, color: '#B8FF3F' },
              { title: 'Fullstack Developer', company: 'TechGrove · IN', score: 85, color: '#B8FF3F' },
              { title: 'Node.js Developer', company: 'Zeta · Remote', score: 79, color: '#EAB308' },
              { title: 'CUDA Developer', company: 'Sourcebae · Remote', score: 76, color: '#EAB308' },
            ].map((job, i) => (
              <div key={i} style={{ background: '#13131F', border: '1px solid #2D2D3A', borderRadius: '13px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', margin: '0', lineHeight: '1.4', flex: 1, paddingRight: '8px' }}>{job.title}</p>
                  <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: '700', color: job.color }}>{job.score}%</span>
                </div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 12px' }}>{job.company}</p>
                <div style={{ height: '4px', background: '#1E1E2E', borderRadius: '2px' }}>
                  <div style={{ width: `${job.score}%`, height: '4px', background: job.color, borderRadius: '2px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="features" style={{ padding: '80px 60px', borderTop: '1px solid #1A1A2A', background: '#0D0D14' }}>
        <p style={{ fontSize: '13px', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', margin: '0 0 54px' }}>
          Everything you need to land the right job
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { icon: 'ti-brain', title: 'Smart matching', desc: 'Vector embeddings match your resume by meaning — not just keywords. "Express dev" matches "Node.js backend."' },
            { icon: 'ti-target', title: 'ATS optimizer', desc: 'Find exact phrases ATS systems scan for. Add them before applying so your resume gets past the bots.' },
            { icon: 'ti-chart-bar', title: 'Shortlist odds', desc: 'AI estimates your shortlist likelihood before you spend hours filling out an application.' },
            { icon: 'ti-mail', title: 'Cover letter AI', desc: 'Personalized cover letter for each job using your actual resume experience. Done in seconds.' },
          ].map((feature, i) => (
            <div key={i} style={{ background: '#13131F', border: '1px solid #2D2D3A', borderRadius: '16px', padding: '30px 26px' }}>
              <FeatureIcon icon={feature.icon} />
              <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px', letterSpacing: '-0.2px' }}>{feature.title}</p>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: '0', lineHeight: '1.7' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="howitworks" style={{ padding: '80px 60px', background: '#0A0A0F' }}>
        <p style={{ fontSize: '13px', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', margin: '0 0 54px' }}>
          How it works
        </p>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '28px', left: '12.5%', right: '12.5%', height: '2px', background: '#2D2D3A', zIndex: 0 }}></div>
            {[
              { step: '01', icon: 'ti-file-upload', title: 'Upload resume', desc: 'Drop your PDF. AI extracts your skills, experience and education automatically.' },
              { step: '02', icon: 'ti-world-search', title: 'We search', desc: 'ElevAI searches JSearch, Adzuna and RemoteOK for real live openings right now.' },
              { step: '03', icon: 'ti-bolt', title: 'Get ranked matches', desc: 'Jobs are ranked by semantic similarity — not just keyword overlap.' },
              { step: '04', icon: 'ti-rocket', title: 'Apply smarter', desc: 'Check ATS keywords, generate a cover letter, and track every application.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 20px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '56px', height: '56px', background: '#13131F', border: '2px solid #B8FF3F', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <i className={`ti ${item.icon}`} style={{ fontSize: '24px', color: '#B8FF3F' }} aria-hidden="true"></i>
                </div>
                <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#B8FF3F', margin: '0 0 10px', letterSpacing: '0.08em', fontWeight: '700' }}>{item.step}</p>
                <p style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 10px' }}>{item.title}</p>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '0', lineHeight: '1.7' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 60px 80px', background: '#0A0A0F' }}>
        <div style={{ background: '#13131F', border: '1px solid #2D2D3A', borderRadius: '20px', padding: '70px 60px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-1px', margin: '0 0 16px', lineHeight: '1.2' }}>
            Ready to find jobs that<br />
            <span style={{ color: '#B8FF3F' }}>actually fit you?</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7280', margin: '0 0 32px' }}>
            Upload your resume and get matched to real openings in under 30 seconds.
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{ background: '#B8FF3F', border: 'none', color: '#0A0A0F', fontSize: '16px', fontWeight: '700', padding: '16px 40px', borderRadius: '11px', cursor: 'pointer' }}
          >
            Get started — it's free →
          </button>
        </div>
      </div>

      <div style={{ padding: '24px 60px 32px', borderTop: '1px solid #1A1A2A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Logo size={24} />
          <span style={{ fontSize: '13px', color: '#4B5563' }}>ElevAI — Designed & Built by Yasaswini</span>
        </div>
        <span style={{ fontSize: '13px', color: '#374151' }}>© 2026 Yasaswini. All rights reserved.</span>
      </div>

    </div>
  )
}

export default Landing