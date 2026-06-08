import { useEffect, useRef } from 'react'
import { ArrowUpRight, LayoutDashboard, UtensilsCrossed, Calendar, Mail, Image, FileText } from 'lucide-react'
import { gsap, ScrollTrigger } from '../lib/cinematic'
import { useMagnetic } from '../hooks/useMagnetic'
import './Realisation.css'

const adminFeatures = [
  { icon: UtensilsCrossed, label: 'Menus dynamiques', desc: 'Mise à jour des plats, prix et cartes en temps réel' },
  { icon: Image,           label: 'Galerie photos',   desc: 'Ajout et réorganisation des photos des plats' },
  { icon: Calendar,        label: 'Planning semaine', desc: 'Lieux et horaires de la semaine modifiables' },
  { icon: FileText,        label: 'Privatisations',   desc: 'Consultation et suivi des demandes entrantes' },
  { icon: Mail,            label: 'Emailing',         desc: "Campagnes clients depuis l'interface admin" },
  { icon: LayoutDashboard, label: 'Burger du mois',   desc: 'Activation / désactivation des offres spéciales' },
]

export default function Realisation() {
  const ref = useRef(null)
  const browserRef = useRef(null)
  const phoneRef = useRef(null)
  const ctaRef = useMagnetic(0.3)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08 }
    )
    ref.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* 3D-perspective mockups — tilted in space on entry, straighten as they scroll into view */
      if (browserRef.current) {
        gsap.fromTo(
          browserRef.current,
          { rotateY: -16, rotateX: 7, transformPerspective: 1600 },
          {
            rotateY: 0,
            rotateX: 0,
            ease: 'none',
            scrollTrigger: { trigger: '.case-screens', start: 'top bottom', end: 'center center', scrub: true },
          }
        )
        gsap.to(browserRef.current, {
          yPercent: -7,
          ease: 'none',
          scrollTrigger: { trigger: '.case-screens', start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }
      if (phoneRef.current) {
        gsap.fromTo(
          phoneRef.current,
          { rotateY: 18, rotateX: -6, transformPerspective: 1600 },
          {
            rotateY: 0,
            rotateX: 0,
            ease: 'none',
            scrollTrigger: { trigger: '.case-screens', start: 'top bottom', end: 'center center', scrub: true },
          }
        )
        gsap.to(phoneRef.current, {
          yPercent: 9,
          ease: 'none',
          scrollTrigger: { trigger: '.case-screens', start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }
      ScrollTrigger.refresh()
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section className="realisation section" id="realisations" ref={ref}>
      <div className="container">

        <div className="realisation-header reveal">
          <span className="section-label section-label-light">Réalisations</span>
          <h2 className="section-title section-title-light">Ils nous ont fait confiance</h2>
          <p className="section-subtitle section-subtitle-light">Un projet livré de A à Z — site, admin, et expérience client.</p>
        </div>

        {/* ── Row 1 : hero du projet ── */}
        <div className="case-hero reveal stagger-2">
          <div className="case-hero-info">
            <div className="case-meta">
              <span className="case-tag">Restauration · Côte-d'Or</span>
              <a href="https://leptitgourmand.fr" target="_blank" rel="noopener noreferrer" className="case-url">
                leptitgourmand.fr <ArrowUpRight size={11} />
              </a>
            </div>
            <h3 className="case-title">Le P'tit Gourmand</h3>
            <p className="case-subtitle-text">Bistrot roulant gastronomique</p>
            <p className="case-brief">
              Christopher sillonne la Côte-d'Or avec son bistrot gastronomique. Il lui fallait une vitrine en ligne pour se faire connaître, un moyen de mettre à jour sa carte et son planning lui-même — sans dépendre d'un développeur — et un canal pour centraliser les demandes de ses clients. On a construit l'écosystème qui répond aux trois : site vitrine, interface admin, et module de privatisation en ligne.
            </p>
            <a ref={ctaRef} href="https://leptitgourmand.fr" target="_blank" rel="noopener noreferrer" className="case-cta">
              Voir le site <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="case-screens">
            <div className="case-browser-3d" ref={browserRef}>
              <div className="case-browser">
                <div className="browser-bar">
                  <div className="browser-dots"><span /><span /><span /></div>
                  <div className="browser-address">leptitgourmand.fr</div>
                </div>
                <div className="browser-screen">
                  <img src="/lptg-desktop.png" alt="Le P'tit Gourmand — accueil" className="browser-img" loading="lazy" decoding="async" />
                </div>
              </div>
            </div>
            <div className="case-phone" ref={phoneRef}>
              <div className="phone-frame">
                <div className="phone-notch" />
                <div className="phone-screen">
                  <img src="/lptg-mobile.png" alt="Le P'tit Gourmand — mobile" className="phone-img" loading="lazy" decoding="async" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2 : interface admin ── */}
        <div className="case-row2">

          {/* Admin features card */}
          <div className="admin-card reveal stagger-2">
            <div className="admin-card-header">
              <LayoutDashboard size={16} />
              <span>Interface Admin</span>
              <span className="admin-badge">Inclus</span>
            </div>
            <p className="admin-card-intro">
              Christopher gère tout son site lui-même depuis un tableau de bord pensé pour son usage — aucune compétence technique requise.
            </p>
            <div className="admin-features">
              {adminFeatures.map((f, i) => {
                const Icon = f.icon
                return (
                  <div key={i} className="admin-feature">
                    <div className="admin-feature-icon"><Icon size={14} /></div>
                    <div>
                      <span className="admin-feature-label">{f.label}</span>
                      <span className="admin-feature-desc">{f.desc}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
