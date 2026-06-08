import { useEffect, useRef } from 'react'
import { gsap } from '../lib/cinematic'
import './Process.css'

const steps = [
  {
    num: '01',
    title: 'On se parle',
    body: 'Un premier échange pour comprendre votre business, vos besoins, vos douleurs. Pas de formulaire de brief de 40 pages. Une vraie conversation.',
  },
  {
    num: '02',
    title: 'On propose',
    body: 'Une proposition claire : périmètre, délai, prix. Vous savez exactement ce que vous obtenez avant de signer quoi que ce soit.',
  },
  {
    num: '03',
    title: 'On construit',
    body: 'On développe votre solution en vous tenant informé à chaque étape. Vous voyez le projet prendre forme avant même la livraison finale.',
  },
  {
    num: '04',
    title: 'On livre et on reste',
    body: 'Mise en ligne, formation, prise en main — et on continue d\'être là pour faire évoluer votre outil avec vous.',
  },
]

export default function Process() {
  const sectionRef = useRef(null)
  const stepRefs = useRef([])
  const lineRef = useRef(null)
  const numRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    )
    stepRefs.current.forEach((el) => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Progress line fills precisely with scroll position through the steps — true scroll storytelling */
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.process-steps',
              start: 'top 65%',
              end: 'bottom 75%',
              scrub: 0.6,
            },
          }
        )
      }

      /* Giant step numbers drift slightly slower than the content for cinematic depth */
      numRefs.current.forEach((el) => {
        if (!el) return
        gsap.to(el, {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="process section" id="processus" ref={sectionRef}>
      <div className="container">
        <div className="process-layout">
          <div className="process-header reveal" ref={(el) => (stepRefs.current[10] = el)}>
            <span className="section-label section-label-light">Processus</span>
            <h2 className="section-title section-title-light">Comment ça se passe</h2>
            <p className="section-subtitle section-subtitle-light">Simple, transparent, sans surprise.</p>
          </div>

          <div className="process-steps">
            <div className="process-line-track">
              <div className="process-line-fill" ref={lineRef} />
            </div>

            {steps.map((step, i) => (
              <div
                key={step.num}
                className="process-step reveal"
                ref={(el) => (stepRefs.current[i] = el)}
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div className="process-dot">
                  <span className="process-dot-inner" />
                </div>
                <div className="process-step-content">
                  <span
                    className="process-step-num"
                    aria-hidden="true"
                    ref={(el) => (numRefs.current[i] = el)}
                  >{step.num}</span>
                  <h3 className="process-step-title">{step.title}</h3>
                  <p className="process-step-body">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
