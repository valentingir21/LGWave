import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Mail, MapPin } from 'lucide-react'
import { gsap, ScrollTrigger, attachMagneticField } from '../lib/cinematic'
import './Contact.css'

function FloatingField({ id, name, label, type = 'text', required, optional, textarea, rows, value, onChange }) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  const shared = {
    id,
    name,
    className: 'field-input',
    value,
    onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    required,
  }

  return (
    <div className={`field ${active ? 'field-active' : ''}`}>
      {textarea ? <textarea {...shared} rows={rows} /> : <input {...shared} type={type} />}
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="required"> *</span>}
        {optional && <span className="form-optional"> (optionnel)</span>}
      </label>
      <span className="field-line" aria-hidden="true" />
    </div>
  )
}

export default function Contact() {
  const ref = useRef(null)
  const pathRef = useRef(null)
  const submitRef = useRef(null)
  const [form, setForm] = useState({
    prenom: '', nom: '', entreprise: '', email: '', telephone: '', besoin: ''
  })
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    const els = ref.current?.querySelectorAll('.reveal')
    els?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => attachMagneticField(submitRef.current, { radius: 80, strength: 0.4 }), [])

  /* Decorative line draws itself in as the section scrolls into view —
     same scroll-storytelling language as the Services divider and Process timeline. */
  useEffect(() => {
    const path = pathRef.current
    if (!path) return undefined
    const length = path.getTotalLength()

    const ctx = gsap.context(() => {
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'bottom 65%', scrub: 0.6 },
      })
      ScrollTrigger.refresh()
    }, ref)

    return () => ctx.revert()
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('sent')
    /* Actual form submission would go here — Supabase, Resend, etc. */
  }

  return (
    <section className="contact section" id="contact" ref={ref}>
      <div className="contact-glow" aria-hidden="true" />
      <svg className="contact-deco" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path
          ref={pathRef}
          className="contact-deco-path"
          d="M -60 880 C 220 760, 160 460, 460 480 S 880 280, 1060 60"
        />
      </svg>

      <div className="container">
        <div className="contact-layout">
          <div className="contact-left reveal">
            <span className="section-label section-label-light">Contact</span>
            <h2 className="contact-title">Démarrons ensemble</h2>
            <p className="contact-subtitle">
              Un premier échange, c'est gratuit et sans engagement. Dites-nous où vous en êtes — on vous dit ce qu'on peut faire pour vous.
            </p>

            <div className="contact-infos">
              <a href="mailto:hello@lg-wave.fr" className="contact-info">
                <div className="contact-info-icon"><Mail size={18} strokeWidth={1.5} /></div>
                <div>
                  <span className="contact-info-label">Email</span>
                  <span className="contact-info-value">hello@lg-wave.fr</span>
                </div>
              </a>
              <div className="contact-info">
                <div className="contact-info-icon"><MapPin size={18} strokeWidth={1.5} /></div>
                <div>
                  <span className="contact-info-label">Localisation</span>
                  <span className="contact-info-value">Dijon, Bourgogne</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrap reveal stagger-2">
            {status === 'sent' ? (
              <div className="contact-success">
                <div className="contact-success-icon">✓</div>
                <h3>Message envoyé !</h3>
                <p>On vous recontacte dans les 24h ouvrées. À très vite.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="field-row">
                  <FloatingField id="prenom" name="prenom" label="Prénom" required value={form.prenom} onChange={handleChange} />
                  <FloatingField id="nom" name="nom" label="Nom" required value={form.nom} onChange={handleChange} />
                </div>

                <FloatingField id="entreprise" name="entreprise" label="Entreprise / activité" value={form.entreprise} onChange={handleChange} />
                <FloatingField id="email" name="email" label="Email" type="email" required value={form.email} onChange={handleChange} />
                <FloatingField id="telephone" name="telephone" label="Téléphone" type="tel" optional value={form.telephone} onChange={handleChange} />

                <FloatingField
                  id="besoin" name="besoin" label="Votre besoin en quelques mots"
                  required textarea rows={4}
                  value={form.besoin} onChange={handleChange}
                />
                <p className="field-hint">
                  Ex : « Je cherche à créer un site pour mon restaurant avec un système de réservation en ligne. Aujourd'hui je gère tout par téléphone et j'aimerais automatiser ça. »
                </p>

                <button ref={submitRef} type="submit" className="contact-submit">
                  <span className="contact-submit-fill" aria-hidden="true" />
                  <span className="contact-submit-label">Envoyer ma demande <ArrowRight size={15} /></span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
