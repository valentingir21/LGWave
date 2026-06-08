import { useEffect, useRef } from 'react'
import { attachMagnetic } from '../lib/cinematic'

/** Returns a ref to spread onto a button/link for a magnetic hover pull. */
export function useMagnetic(strength = 0.35) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return undefined
    return attachMagnetic(ref.current, strength)
  }, [strength])

  return ref
}
