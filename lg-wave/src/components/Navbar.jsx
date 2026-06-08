import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { useMagnetic } from '../hooks/useMagnetic'
import './Navbar.css'

const LogoDark = () => (
  <div className="navbar-logo" aria-label="LG Wave">
    <span className="navbar-logo-lg">LG</span>
    <div className="navbar-logo-wave-group">
      <span className="navbar-logo-wave">Wave</span>
      <svg
        className="navbar-logo-curve"
        viewBox="110 55 130 30"
        preserveAspectRatio="none"
        overflow="visible"
        aria-hidden="true"
      >
        <path
          d="M116 70 C155 50 195 90 234 70"
          stroke="#5b9de8"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  </div>
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const ctaRef = useMagnetic(0.25)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="#" className="navbar-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}) }}>
            <LogoDark />
          </a>

          <ul className="nav-links">
            {[['services','Services'],['realisations','Réalisations'],['processus','Processus'],['contact','Contact']].map(([id, label]) => (
              <li key={id}>
                <button className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
              </li>
            ))}
          </ul>

          <button ref={ctaRef} className="btn-primary nav-cta" onClick={() => scrollTo('contact')}>
            Démarrer <ArrowRight size={14} />
          </button>

          <button
            className={`burger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          {[['services','Services'],['realisations','Réalisations'],['processus','Processus'],['contact','Contact']].map(([id, label]) => (
            <li key={id}>
              <button className="mobile-link" onClick={() => scrollTo(id)}>{label}</button>
            </li>
          ))}
        </ul>
        <button className="btn-primary mobile-cta" onClick={() => scrollTo('contact')}>
          Démarrer <ArrowRight size={14} />
        </button>
      </div>
    </>
  )
}
