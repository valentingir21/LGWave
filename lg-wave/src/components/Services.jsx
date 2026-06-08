import { useEffect, useRef } from 'react'
import { Globe, Cpu, BarChart2, Sparkles, Shield } from 'lucide-react'
import { gsap, ScrollTrigger, attachTilt } from '../lib/cinematic'
import './Services.css'

const services = [
  {
    number: '01',
    icon: Globe,
    label: 'Site vitrine',
    title: 'Votre vitrine, votre outil, administrable',
    desc: 'Un site qui vous ressemble et qui travaille pour vous. Gestion de contenu, emailing, espace client, réservations, paiement en ligne, commandes — on intègre les fonctionnalités dont vous avez besoin, pas un template préfabriqué. Ces exemples sont illustratifs : adapté à votre métier, construit pour vos besoins.',
    tags: ['Site complet', 'Design sur-mesure', 'Mobile first', 'SEO local', 'Hébergement'],
  },
  {
    number: '02',
    icon: Cpu,
    label: 'SaaS métier',
    title: 'Votre logiciel métier, enfin taillé pour vous',
    desc: 'Réservations, devis, suivi de commandes, espace client, RH, facturation — on code exactement ce dont vous avez besoin. Pas les 80 fonctionnalités d\'un logiciel générique. Juste les vôtres.',
    tags: ['Développement sur-mesure', 'Interface admin', 'Évolutions incluses'],
  },
  {
    number: '03',
    icon: BarChart2,
    label: 'Dashboard',
    title: 'Pilotez votre business en un coup d\'œil',
    desc: 'Un tableau de bord qui centralise vos données clés — CA, réservations, taux de conversion, stocks, performances. Fini les tableaux Excel. Tout est là, clair, en temps réel.',
    tags: ['Dashboard personnalisé', 'KPIs métier', 'Accès mobile'],
  },
  {
    number: '04',
    icon: Sparkles,
    label: 'IA intégrée',
    title: 'L\'intelligence artificielle au service de votre business',
    desc: 'Votre assistant qui répond aux clients à 23h, votre outil qui analyse vos ventes chaque matin. On intègre l\'IA directement dans vos outils existants — agents, automatisations, génération de contenu.',
    tags: ['Intégration IA', 'Automatisation', 'Formation incluse'],
  },
  {
    number: '05',
    icon: Shield,
    label: 'Maintenance',
    title: 'On reste là après la livraison',
    desc: 'Un site ou un outil, ça évolue. Nouvelle fonctionnalité, mise à jour, bug à corriger — on est disponibles et réactifs. Vous avez un interlocuteur direct qui connaît votre projet sur le bout des doigts. Pas un ticket de support envoyé dans le vide.',
    tags: ['Maintenance mensuelle', 'Évolutions', 'Support direct', 'Monitoring'],
  },
]

function ServiceCard({ service, innerRef }) {
  const Icon = service.icon
  return (
    <article className="service-card" ref={innerRef}>
      <span className="spotlight" aria-hidden="true" />
      <span className="service-number" aria-hidden="true">{service.number}</span>
      <div className="service-card-inner">
        <div className="service-icon-wrap">
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <div className="service-card-label">{service.label}</div>
        <h3 className="service-title">{service.title}</h3>
        <p className="service-desc">{service.desc}</p>
        <div className="service-tags">
          {service.tags.map((tag, j) => (
            <span key={j} className="service-tag">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function Services() {
  const sectionRef = useRef(null)
  const cardRefs = useRef([])
  const lineRef = useRef(null)

  useEffect(() => {
    const cleanups = cardRefs.current.filter(Boolean).map((el) => attachTilt(el, { max: 4, lift: 1.0 }))

    const ctx = gsap.context(() => {
      const line = lineRef.current
      if (line) {
        const length = line.getTotalLength()
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: line, start: 'top 90%', end: 'top 55%', scrub: true },
        })
      }
      ScrollTrigger.refresh()
    }, sectionRef)

    return () => {
      cleanups.forEach((fn) => fn())
      ctx.revert()
    }
  }, [])

  return (
    <section className="services section" id="services" ref={sectionRef}>
      <div className="container">
        <div className="services-header">
          <span className="section-label section-label-light">Services</span>
          <h2 className="section-title section-title-light">Ce qu'on construit pour vous</h2>
          <p className="section-subtitle section-subtitle-light">
            Des outils digitaux sur-mesure, conçus autour de votre métier — pas l'inverse.
          </p>
        </div>

        <div className="services-editorial">
          <div className="services-row services-row-top">
            <ServiceCard service={services[0]} innerRef={(el) => (cardRefs.current[0] = el)} />
            <div className="services-stack">
              <ServiceCard service={services[1]} innerRef={(el) => (cardRefs.current[1] = el)} />
              <ServiceCard service={services[2]} innerRef={(el) => (cardRefs.current[2] = el)} />
            </div>
          </div>

          <svg className="services-divider" aria-hidden="true" preserveAspectRatio="none">
            <line ref={lineRef} x1="0" y1="1" x2="100%" y2="1" />
          </svg>

          <div className="services-row services-row-bottom">
            <ServiceCard service={services[3]} innerRef={(el) => (cardRefs.current[3] = el)} />
            <ServiceCard service={services[4]} innerRef={(el) => (cardRefs.current[4] = el)} />
          </div>
        </div>
      </div>
    </section>
  )
}
