import { useEffect, useRef, useState } from 'react'
import { isCoarsePointer, prefersReducedMotion } from '../../lib/cinematic'
import './Cursor.css'

const HOVER_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-cursor-hover]'
const LERP = 0.12

export default function Cursor() {
  const wrapperRef = useRef(null)
  const [hovering, setHovering] = useState(false)
  const enabled = !isCoarsePointer() && !prefersReducedMotion()

  useEffect(() => {
    if (!enabled) return undefined

    document.documentElement.classList.add('cursor-active')

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let x = mouseX
    let y = mouseY
    let raf

    const handleMove = (e) => { mouseX = e.clientX; mouseY = e.clientY }
    const handleOver = (e) => { if (e.target.closest?.(HOVER_SELECTOR)) setHovering(true) }
    const handleOut = (e) => { if (e.target.closest?.(HOVER_SELECTOR)) setHovering(false) }

    const tick = () => {
      x += (mouseX - x) * LERP
      y += (mouseY - y) * LERP
      if (wrapperRef.current) wrapperRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('cursor-active')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="cursor" ref={wrapperRef} aria-hidden="true">
      <span className={`cursor-dot${hovering ? ' is-hovering' : ''}`} />
    </div>
  )
}
