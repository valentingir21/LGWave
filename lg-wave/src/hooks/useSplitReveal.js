import { useEffect, useRef } from 'react'
import Splitting from 'splitting'
import { gsap, prefersReducedMotion } from '../lib/cinematic'

/**
 * Splits the target's text into characters (Splitting.js) and plays a
 * cinematic per-character entrance: rising from below through a dissolving
 * blur, staggered like film credits. Returns a ref to spread onto the element.
 */
export function useSplitReveal({ stagger = 0.04, delay = 0.2 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const target = ref.current
    if (!target) return undefined

    if (prefersReducedMotion()) {
      gsap.set(target, { opacity: 1 })
      return undefined
    }

    const [result] = Splitting({ target, by: 'chars' })
    const chars = result.chars

    gsap.set(target, { opacity: 1 })
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { opacity: 0, yPercent: 130, filter: 'blur(16px)' },
        {
          opacity: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: 1,
          stagger,
          delay,
          ease: 'power4.out',
        }
      )
    })

    return () => ctx.revert()
  }, [stagger, delay])

  return ref
}
