import { useEffect, useState } from 'react'
import { initSmoothScroll } from './lib/cinematic'
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

export default function App() {
  const [introComplete, setIntroComplete] = useState(
    () => sessionStorage.getItem('introSeen') === 'true'
  )

  useEffect(() => {
    if (!introComplete) return undefined
    // Lenis is driven by gsap.ticker so every ScrollTrigger stays in sync
    // with the smoothed scroll position (see src/lib/cinematic.js). Held back
    // until the intro hands off — no scroll engine should run under a locked body.
    return initSmoothScroll()
  }, [introComplete])

  return (
    <>
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
