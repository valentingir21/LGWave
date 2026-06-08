import { useEffect, useRef, Suspense, lazy } from 'react'
import { ArrowRight } from 'lucide-react'
import { gsap, attachMagneticField } from '../lib/cinematic'
import { useSplitReveal } from '../hooks/useSplitReveal'
import { useMediaQuery } from '../hooks/useMediaQuery'
import './Hero.css'

const HeroOcean = lazy(() => import('./HeroOcean'))

export default function Hero() {
  const heroRef        = useRef(null)
  const heroOceanRef   = useRef(null)
  const heroContentRef = useRef(null)
  const ctaRef         = useRef(null)
  const titleRef       = useSplitReveal({ stagger: 0.035, delay: 0.35 })

  const canRenderOcean = useMediaQuery('(min-width: 880px) and (pointer: fine)')
  const reduceMotion   = useMediaQuery('(prefers-reduced-motion: reduce)')
  const showOcean      = canRenderOcean && !reduceMotion

  // CTA entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-cta-row',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
      )
    }, heroRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => attachMagneticField(ctaRef.current, { radius: 80, strength: 0.45 }), [])

  // Scroll-out transition: ocean glides down, content fades up
  useEffect(() => {
    if (reduceMotion) return undefined
    const ctx = gsap.context(() => {
      gsap.to(heroOceanRef.current, {
        y: 60,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=30%',
          scrub: 0.8,
        },
      })
      gsap.to(heroContentRef.current, {
        opacity: 0,
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=30%',
          scrub: 0.8,
        },
      })
    })
    return () => ctx.revert()
  }, [reduceMotion])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="home" ref={heroRef}>
      <div className="hero-ocean" ref={heroOceanRef} aria-hidden="true">
        {showOcean ? (
          <Suspense fallback={<div className="hero-ocean-fallback" />}>
            <HeroOcean />
          </Suspense>
        ) : (
          <div className="hero-ocean-fallback" />
        )}
      </div>

      <div className="hero-vignette" aria-hidden="true" />

      <div className="hero-content" ref={heroContentRef}>
        <h1 className="hero-title" ref={titleRef}>
          <span className="line-white">Vos problèmes deviennent</span><br />
          <span className="line-blue">vos outils.</span><br />
          <span className="line-white">Vos outils font tourner</span><br />
          <span className="line-blue">votre business.</span>
        </h1>

        <div className="hero-cta-row">
          <button ref={ctaRef} className="hero-cta-magnetic" onClick={() => scrollTo('contact')}>
            <span className="hero-cta-fill" aria-hidden="true" />
            <span className="hero-cta-label">Parler de votre projet <ArrowRight size={15} /></span>
          </button>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span className="hero-scroll-line" />
        <span className="hero-scroll-text">Scroll</span>
      </div>

    </section>
  )
}
