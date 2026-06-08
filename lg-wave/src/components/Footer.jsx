import './Footer.css'

const LogoDark = () => (
  <svg width="160" height="44" viewBox="0 0 300 82" fill="none" aria-label="LG Wave">
    <text x="0" y="54" fontFamily="Georgia,'Times New Roman',serif"
      fontWeight="700" fontSize="54" letterSpacing="-1" fill="#ffffff">LG</text>
    <text x="116" y="54" fontFamily="'Helvetica Neue',Helvetica,Arial,sans-serif"
      fontWeight="300" fontSize="52" letterSpacing="-1" fill="#5b9de8">Wave</text>
    <path d="M116 70 C155 50 195 90 234 70"
      stroke="#5b9de8" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
  </svg>
)

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  return (
    <footer className="footer">
      {/* Decorative wave */}
      <div className="footer-wave-wrap" aria-hidden="true">
        <svg className="footer-wave" viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none">
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,0 L0,0 Z"
            fill="rgba(255,255,255,0.03)"/>
          <path d="M0,30 C240,0 480,60 720,30 C960,0 1200,60 1440,30 L1440,0 L0,0 Z"
            fill="rgba(91,157,232,0.04)"/>
        </svg>
      </div>

      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <LogoDark />
            <p className="footer-tagline">La vague digitale qui transforme votre business</p>
            <a href="mailto:hello@lg-wave.fr" className="footer-email">hello@lg-wave.fr</a>
          </div>

          <div className="footer-nav-group">
            <span className="footer-nav-title">Navigation</span>
            <ul className="footer-nav">
              {[['services','Services'],['realisations','Réalisations'],['processus','Processus'],['tarifs','Tarifs'],['contact','Contact']].map(([id, label]) => (
                <li key={id}>
                  <button className="footer-link" onClick={() => scrollTo(id)}>{label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-nav-group">
            <span className="footer-nav-title">Contact</span>
            <ul className="footer-nav">
              <li><a href="mailto:hello@lg-wave.fr" className="footer-link">hello@lg-wave.fr</a></li>
              <li><span className="footer-link" style={{cursor:'default'}}>Dijon, Bourgogne</span></li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <span className="footer-copy">© 2026 LG Wave — Dijon, France</span>
          <div className="footer-legal">
            <a href="#" className="footer-legal-link">Mentions légales</a>
            <a href="#" className="footer-legal-link">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
