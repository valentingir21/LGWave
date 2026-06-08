import { useEffect, useRef, useState } from 'react'
import { MapPin, Code2, ThumbsUp, Users } from 'lucide-react'
import { attachTilt } from '../lib/cinematic'
import './Reassurance.css'

const args = [
  {
    icon: MapPin,
    title: 'Basés à Dijon',
    body: 'On vous rencontre en vrai. Pas d\'agence fantôme à l\'autre bout de la France — on est à côté de vous, disponibles, joignables.',
    stat: null,
  },
  {
    icon: Code2,
    title: '100% sur-mesure',
    body: 'Zéro template, zéro Wix, zéro WordPress préfabriqué. Chaque projet est codé de A à Z pour vous et uniquement vous.',
    stat: { value: 100, suffix: '%', label: 'Sur-mesure' },
  },
  {
    icon: ThumbsUp,
    title: 'Satisfaction garantie',
    body: 'On ne lâche pas le projet tant que vous n\'êtes pas pleinement satisfait. C\'est notre engagement, pas juste une formule.',
    stat: null,
  },
  {
    icon: Users,
    title: 'Partenaires sur le long terme',
    body: 'On ne disparaît pas après la livraison. On construit une relation durable pour que votre outil évolue avec votre business.',
    stat: null,
  },
]

function useCountUp(target, duration = 1500, active = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active || target === null) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start = Math.min(start + step, target)
      setValue(Math.round(start))
      if (start >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [active, target, duration])
  return value
}

function StatCard({ stat, active }) {
  const count = useCountUp(stat?.value ?? null, 1200, active)
  if (!stat) return null
  return (
    <div className="reassurance-stat">
      <span className="reassurance-stat-value">{count}{stat.suffix}</span>
      <span className="reassurance-stat-label">{stat.label}</span>
    </div>
  )
}

export default function Reassurance() {
  const cardRefs = useRef([])
  const [activeCards, setActiveCards] = useState({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            const idx = e.target.dataset.idx
            setActiveCards((prev) => ({ ...prev, [idx]: true }))
          }
        })
      },
      { threshold: 0.25 }
    )
    cardRefs.current.forEach((el) => { if (el) observer.observe(el) })

    /* Premium cursor-tilt + spotlight on the argument cards (skip the header at index 10) */
    const cleanups = cardRefs.current
      .filter((el, i) => el && i !== 10)
      .map((el) => attachTilt(el, { max: 6, lift: 1.02 }))

    return () => {
      observer.disconnect()
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return (
    <section className="reassurance section" id="reassurance">
      <div className="container">
        <div className="reassurance-header reveal" ref={(el) => (cardRefs.current[10] = el)} data-idx="10">
          <span className="section-label section-label-light">Pourquoi LG Wave</span>
          <h2 className="section-title section-title-light">Ce qui nous différencie</h2>
        </div>

        <div className="reassurance-grid">
          {args.map((a, i) => {
            const Icon = a.icon
            return (
              <div
                key={i}
                className="reassurance-card reveal"
                ref={(el) => (cardRefs.current[i] = el)}
                data-idx={i}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span className="spotlight" aria-hidden="true" />
                <div className="reassurance-icon">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="reassurance-title">{a.title}</h3>
                <p className="reassurance-body">{a.body}</p>
                <StatCard stat={a.stat} active={!!activeCards[i]} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
