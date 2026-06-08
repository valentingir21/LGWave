import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../../lib/cinematic'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import './intro.css'

const BASELINE_WORDS = 'La vague digitale qui transforme votre business'.split(' ')
const ZOOM_TRIGGER_TIME = 16
/* Playing at 4× so Phase 1 (video → zoom trigger) lasts exactly 4s real time
   (16s source ÷ 4 = 4s). The spray/cut choreography is unchanged — still
   triggered at the 16s mark of the source. */
const PLAYBACK_RATE = 4.0

/**
 * Phases 2 → 8 — one continuous timeline, started once the source video
 * reaches its 16s mark (the splash/spray moment the cut is built around).
 * Relative offsets ('-=', '+=', '<') chain the phases exactly as timed
 * in the brief: zoom + flash → navy wash → L → G → Wave → baseline → exit.
 */
function buildSequenceTimeline(refs, { letterOffsetL, letterOffsetG }) {
  const tl = gsap.timeline()

  /* Phase 2 — zoom on the spray + white flash (16 → 18s) */
  tl.to(refs.video.current, {
    scale: 1.8,
    duration: 2,
    ease: 'power2.in',
    transformOrigin: '60% 40%',
  })
  tl.to(refs.overlayWhite.current, { opacity: 1, duration: 0.8, ease: 'power2.in' }, '-=0.6')

  /* Phase 3 — white dissolves into navy, the video is retired (18 → 19s) */
  tl.to(refs.overlayBlue.current, { opacity: 1, duration: 1, ease: 'power2.inOut' })
  tl.set(refs.video.current, { display: 'none' })

  /* Phase 4 — "L" (19 → 20s) */
  tl.to(refs.letterL.current, { opacity: 1, duration: 0.7, ease: 'power3.out' }, '+=0.2')

  /* Phase 5 — "G" joins, "L" steps aside to make room (20 → 21s).
     Offsets are measured from the live glyph widths (see `advance`) rather
     than fixed em guesses, so the LG pair's combined visual centre always
     lands on the viewport centre — exactly where "Wave" sits below it. */
  tl.to(refs.letterL.current, { x: letterOffsetL, duration: 0.5, ease: 'power2.inOut' }, '+=0.3')
  tl.to(refs.letterG.current, { opacity: 1, x: letterOffsetG, duration: 0.7, ease: 'power3.out' }, '<')

  /* Phase 6 — "Wave" + its underline curve, drawn in 0.2s after Wave appears (21 → 22.5s) */
  tl.addLabel('wave-in', '+=0.3')
  tl.to(refs.wave.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 'wave-in')
  tl.to(refs.curveSvg.current, { scale: 1, duration: 1, ease: 'power3.out' }, 'wave-in+=0.2')
  tl.to(refs.curvePath.current, { strokeDashoffset: 0, duration: 1, ease: 'power3.out' }, 'wave-in+=0.2')

  /* Phase 7 — baseline, word by word (22.5 → 23.5s) */
  tl.to(refs.baseline.current.children, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out',
  }, '+=0.2')

  /* Phase 8 — everything lifts away, the navy dissolves into the site (23.5 → 25s) */
  tl.to(
    [refs.letterL.current, refs.letterG.current, refs.wave.current, refs.curveWrap.current, refs.baseline.current],
    { opacity: 0, y: -20, duration: 0.6, stagger: 0.05, ease: 'power2.in' },
    '+=1'
  )
  tl.to(refs.overlayBlue.current, { opacity: 0, duration: 1.2, ease: 'power2.inOut' })

  return tl
}

export default function Intro({ onComplete }) {
  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const overlayWhiteRef = useRef(null)
  const overlayBlueRef = useRef(null)
  const letterLRef = useRef(null)
  const letterGRef = useRef(null)
  const waveRef = useRef(null)
  const curveWrapRef = useRef(null)
  const curveSvgRef = useRef(null)
  const curvePathRef = useRef(null)
  const baselineRef = useRef(null)
  const timelineRef = useRef(null)

  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const refs = {
    video: videoRef,
    overlayWhite: overlayWhiteRef,
    overlayBlue: overlayBlueRef,
    letterL: letterLRef,
    letterG: letterGRef,
    wave: waveRef,
    curveWrap: curveWrapRef,
    curveSvg: curveSvgRef,
    curvePath: curvePathRef,
    baseline: baselineRef,
  }

  const finish = () => {
    sessionStorage.setItem('introSeen', 'true')
    onComplete()
  }

  /* Lock scroll for the duration of the intro — fixed body, no Lenis drift. */
  useEffect(() => {
    const { body } = document
    const scrollY = window.scrollY
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.overflow = 'hidden'

    return () => {
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  /* Reduced motion → straight to the site, no 25s autoplaying video + flash. */
  useEffect(() => {
    if (reduceMotion || prefersReducedMotion()) finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return undefined

    const ctx = gsap.context(() => {
      /* L and G start stacked on the same centre point — Phase 5 then
         splits them apart with relative `x` offsets (translate(-50%,-50%)
         expressed as xPercent/yPercent so GSAP can layer `x` on top of it). */
      gsap.set([letterLRef.current, letterGRef.current], { xPercent: -50, yPercent: -50 })

      /* Underline curve — primed to "draw" via stroke-dashoffset and to
         pop in via a uniform scale (see Phase 6 in buildSequenceTimeline). */
      const pathLength = curvePathRef.current.getTotalLength()
      gsap.set(curvePathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength })
      gsap.set([curveWrapRef.current, curveSvgRef.current], { transformOrigin: '50% 50%' })
      gsap.set(curveSvgRef.current, { scale: 0.8 })
    }, rootRef)

    const video = videoRef.current
    let settled = false

    const cleanup = () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
      clearTimeout(guard)
    }
    const advance = () => {
      if (settled) return
      settled = true
      cleanup()
      ctx.add(() => {
        /* Measured, not guessed: glyph widths vary with the font's actual
           render at the current viewport size, so the L/G split offsets are
           derived from `offsetWidth` — guaranteeing the LG pair's combined
           visual centre lands exactly on the viewport centre (where "Wave"
           already sits via flex centering) instead of drifting off it. */
        const fontSize = parseFloat(getComputedStyle(letterLRef.current).fontSize)
        const spread = fontSize * 0.7
        const correction = (letterLRef.current.offsetWidth - letterGRef.current.offsetWidth) / 4
        const letterOffsetL = -spread / 2 + correction
        const letterOffsetG = spread / 2 + correction

        /* Same idea for the curve: the logo's wave is far too narrow for the
           intro's much larger "Wave", so it's stretched horizontally with a
           static scaleX correction (on the wrapper) — independent from the
           Phase 6 entrance `scale` tween (on the inner svg) so the two never
           fight over the same transform property. */
        /* The wrapper still carries no transform at this point (only
           transformOrigin), so its rect is the SVG's true natural width —
           `<svg>` is an SVGElement and has no `offsetWidth` of its own. */
        gsap.set(curveWrapRef.current, {
          scaleX: waveRef.current.offsetWidth / curveWrapRef.current.getBoundingClientRect().width,
        })

        const tl = buildSequenceTimeline(refs, { letterOffsetL, letterOffsetG })
        tl.eventCallback('onComplete', finish)
        timelineRef.current = tl
      })
    }
    const bail = () => {
      if (settled) return
      settled = true
      cleanup()
      finish()
    }
    const handleTimeUpdate = () => { if (video.currentTime >= ZOOM_TRIGGER_TIME) advance() }
    const handleEnded = () => advance()
    const handleError = () => bail()

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)
    video.playbackRate = PLAYBACK_RATE
    video.play()?.catch(bail)

    /* Bounded safety net — if the 16s mark never arrives (autoplay refused,
       decode stall, network hiccup…) the cinematic must still resolve
       instead of stranding the visitor on a frozen frame. */
    const guard = setTimeout(advance, 8000)

    return () => {
      cleanup()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion])

  const handleSkip = () => {
    if (timelineRef.current) timelineRef.current.kill()
    gsap.killTweensOf([
      videoRef.current,
      overlayWhiteRef.current,
      overlayBlueRef.current,
      letterLRef.current,
      letterGRef.current,
      waveRef.current,
      curveWrapRef.current,
      curveSvgRef.current,
      curvePathRef.current,
    ])

    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: finish,
    })
  }

  return (
    <div className="intro" ref={rootRef}>
      <video
        ref={videoRef}
        className="intro-video"
        src="/videos/VideoIntro.mp4"
        autoPlay
        muted
        playsInline
      />

      <div className="intro-overlay-white" ref={overlayWhiteRef} aria-hidden="true" />
      <div className="intro-overlay-blue" ref={overlayBlueRef} aria-hidden="true" />

      <div className="intro-stage">
        <div className="intro-letters">
          <span className="intro-letter" ref={letterLRef}>L</span>
          <span className="intro-letter" ref={letterGRef}>G</span>
        </div>
        <span className="intro-wave" ref={waveRef}>Wave</span>
        <div className="intro-wave-curve" ref={curveWrapRef} aria-hidden="true">
          <svg ref={curveSvgRef} className="intro-wave-curve-svg" viewBox="110 55 130 30">
            <path
              ref={curvePathRef}
              d="M116 70 C155 50 195 90 234 70"
              stroke="#5b9de8"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
        <p className="intro-baseline" ref={baselineRef}>
          {BASELINE_WORDS.map((word, i) => (
            <span className="intro-baseline-word" key={i}>{word}</span>
          ))}
        </p>
      </div>

      <button type="button" className="intro-skip" onClick={handleSkip}>
        Passer l'intro <ArrowRight size={12} />
      </button>
    </div>
  )
}
