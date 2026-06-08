/**
 * Reusable Framer Motion variants — shared cinematic entrance language
 * across Transformation / Services / Réassurance / Contact sections.
 */

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export const revealTitle = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] } },
}
