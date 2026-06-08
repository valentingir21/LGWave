import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger, isCoarsePointer, prefersReducedMotion }

/**
 * Boots Lenis smooth scroll driven by gsap.ticker so ScrollTrigger stays
 * perfectly in sync with the smoothed scroll position. Returns a cleanup fn.
 */
export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  // Explicit no-arg call avoids passing Lenis event object to ScrollTrigger.update
  lenis.on('scroll', () => ScrollTrigger.update())

  const update = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(update)
  gsap.ticker.lagSmoothing(0)

  // Hero's ScrollTrigger is created before Lenis (children effects run before
  // parent effects in React). Refresh recalculates trigger positions once
  // Lenis has started and the body is no longer position:fixed.
  ScrollTrigger.refresh()

  return () => {
    gsap.ticker.remove(update)
    lenis.destroy()
  }
}

/**
 * Cursor-driven 3D tilt + spotlight for premium card surfaces.
 * Sets --spot-x/--spot-y custom properties for CSS-side glow overlays.
 * No-op on touch devices and when reduced motion is requested.
 */
export function attachTilt(el, { max = 7, lift = 1.015 } = {}) {
  if (!el || isCoarsePointer() || prefersReducedMotion()) return () => {}

  gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' })

  const rotateX = gsap.quickTo(el, 'rotateX', { duration: 0.6, ease: 'power3.out' })
  const rotateY = gsap.quickTo(el, 'rotateY', { duration: 0.6, ease: 'power3.out' })
  const scale = gsap.quickTo(el, 'scale', { duration: 0.5, ease: 'power3.out' })

  const handleMove = (e) => {
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateY((px - 0.5) * max * 2)
    rotateX(-(py - 0.5) * max * 2)
    scale(lift)
    el.style.setProperty('--spot-x', `${px * 100}%`)
    el.style.setProperty('--spot-y', `${py * 100}%`)
  }

  const handleLeave = () => {
    rotateX(0)
    rotateY(0)
    scale(1)
  }

  el.addEventListener('mousemove', handleMove)
  el.addEventListener('mouseleave', handleLeave)

  return () => {
    el.removeEventListener('mousemove', handleMove)
    el.removeEventListener('mouseleave', handleLeave)
    gsap.killTweensOf(el)
    gsap.set(el, { clearProps: 'transform' })
  }
}

/**
 * Magnetic pull effect — the element gently follows the cursor within its
 * bounds, then eases back on leave. Ideal for premium CTAs.
 */
export function attachMagnetic(el, strength = 0.35) {
  if (!el || isCoarsePointer() || prefersReducedMotion()) return () => {}

  const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
  const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })

  const handleMove = (e) => {
    const rect = el.getBoundingClientRect()
    x((e.clientX - rect.left - rect.width / 2) * strength)
    y((e.clientY - rect.top - rect.height / 2) * strength)
  }

  const handleLeave = () => {
    x(0)
    y(0)
  }

  el.addEventListener('mousemove', handleMove)
  el.addEventListener('mouseleave', handleLeave)

  return () => {
    el.removeEventListener('mousemove', handleMove)
    el.removeEventListener('mouseleave', handleLeave)
    gsap.killTweensOf(el)
    gsap.set(el, { clearProps: 'transform' })
  }
}

/**
 * Magnetic field — unlike attachMagnetic (which only reacts within the
 * element's own box), this tracks the cursor across the whole viewport and
 * pulls the element toward it once it enters `radius` px of the element's
 * edge, with a falloff toward the edge of that field. Built for the hero CTA
 * per spec: "suit le curseur dans un rayon de 80px".
 */
export function attachMagneticField(el, { radius = 80, strength = 0.45 } = {}) {
  if (!el || isCoarsePointer() || prefersReducedMotion()) return () => {}

  const x = gsap.quickTo(el, 'x', { duration: 0.65, ease: 'power3.out' })
  const y = gsap.quickTo(el, 'y', { duration: 0.65, ease: 'power3.out' })

  const handleMove = (e) => {
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const edgeDist = Math.hypot(dx, dy) - Math.max(rect.width, rect.height) / 2

    if (edgeDist < radius) {
      const pull = 1 - Math.max(edgeDist, 0) / radius
      x(dx * strength * pull)
      y(dy * strength * pull)
    } else {
      x(0)
      y(0)
    }
  }

  const reset = () => { x(0); y(0) }

  window.addEventListener('mousemove', handleMove)
  window.addEventListener('mouseleave', reset)

  return () => {
    window.removeEventListener('mousemove', handleMove)
    window.removeEventListener('mouseleave', reset)
    gsap.killTweensOf(el)
    gsap.set(el, { clearProps: 'transform' })
  }
}

/**
 * Ties a numeric tween (e.g. scaleY of a progress line) to scroll progress
 * through a trigger element. Returns the ScrollTrigger instance for cleanup.
 */
export function scrubTo(target, vars, scrollTriggerVars) {
  if (prefersReducedMotion()) return null
  return gsap.to(target, {
    ease: 'none',
    ...vars,
    scrollTrigger: { scrub: 0.6, ...scrollTriggerVars },
  })
}
