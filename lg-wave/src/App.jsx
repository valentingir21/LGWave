import { useEffect, useState, Suspense, lazy } from 'react'
import { initSmoothScroll } from './lib/cinematic'
import { useMediaQuery } from './hooks/useMediaQuery'
import Intro from './components/Intro'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Pillars from './components/Pillars'
import Services from './components/Services'
import Process from './components/Process'
import Reassurance from './components/Reassurance'
import Realisation from './components/Realisation'
import Tarifs from './components/Tarifs'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

const HeroOcean = lazy(() => import('./components/HeroOcean'))

export default function App() {
  const [introComplete, setIntroComplete] = useState(
    () => sessionStorage.getItem('introSeen') === 'true'
  )

  const canRenderOcean = useMediaQuery('(min-width: 880px) and (pointer: fine)')
  const reduceMotion   = useMediaQuery('(prefers-reduced-motion: reduce)')
  const showOcean      = canRenderOcean && !reduceMotion

  useEffect(() => {
    if (!introComplete) return undefined
    const cleanup = initSmoothScroll()
    // Force Framer Motion to re-evaluate whileInView observers now that the
    // layout is stable and Lenis has taken over scroll.
    window.dispatchEvent(new Event('resize'))
    return cleanup
  }, [introComplete])

  return (
    <>
      {/* Fixed ocean canvas — page-level background, always behind all sections */}
      <div className="hero-ocean" aria-hidden="true">
        {showOcean ? (
          <Suspense fallback={null}>
            <HeroOcean />
          </Suspense>
        ) : (
          <div className="hero-ocean-fallback" />
        )}
      </div>

      {!introComplete && <Intro onComplete={() => setIntroComplete(true)} />}

      <Cursor />
      <div className={`site-reveal ${introComplete ? 'is-visible' : ''}`}>
        <Navbar />
        <main>
          <Hero />
          <Pillars />
          <Services />
          <Process />
          <Reassurance />
          <Realisation />
          <Tarifs />
          <Contact />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  )
}
