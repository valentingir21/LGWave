import { useEffect, useRef } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { useMagnetic } from '../hooks/useMagnetic'
import './Tarifs.css'

const factors = [
  'La complexité des fonctionnalités',
  'Le nombre de pages ou d\'écrans',
  'Les intégrations tierces (paiement, SMS, IA...)',
  'Le niveau d\'accompagnement souhaité',
]

export default function Tarifs() {
  const ref = useRef(null)
  const ctaRef = useMagnetic(0.3)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.15 }
    )
    const els = ref.current?.querySelectorAll('.reveal')
    els?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="tarifs section" id="tarifs" ref={ref}>
      <div className="container">
        <div className="tarifs-inner">
          <div className="tarifs-content reveal">
            <span className="section-label section-label-light">Tarifs</span>
            <h2 className="section-title section-title-light">Combien ça coûte ?</h2>
            <p className="tarifs-intro">
              Chaque projet est unique — on ne croit pas aux tarifs forfaitaires qui s'appliquent à tout le monde et ne conviennent à personne.
            </p>
            <p className="tarifs-text">
              On vous propose un devis précis, adapté à votre besoin réel, après un premier échange gratuit. Pas de mauvaise surprise : tout est cadré, écrit, signé avant qu'on commence.
            </p>
            <button
              ref={ctaRef}
              className="btn-primary tarifs-cta"
              onClick={() => document.getElementById('contact').scrollIntoView({behavior:'smooth'})}
            >
              Obtenir un devis gratuit <ArrowRight size={14} />
            </button>
          </div>

          <div className="tarifs-card reveal stagger-2">
            <div className="tarifs-card-header">
              <span className="tarifs-card-label">Ce qui influence le prix</span>
            </div>
            <ul className="tarifs-factors">
              {factors.map((f, i) => (
                <li key={i} className="tarifs-factor">
                  <span className="tarifs-factor-icon"><Check size={13} /></span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="tarifs-card-footer">
              <span className="tarifs-guarantee">Premier échange toujours gratuit, sans engagement.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
