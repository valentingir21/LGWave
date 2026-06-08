import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { attachTilt } from '../lib/cinematic'
import './Pillars.css'

const pillars = [
  {
    title: 'Votre site ne travaille pas pour vous.',
    body: 'Il est beau, il est en ligne — mais il ne génère rien. Pas de prise de rendez-vous, pas de gestion de contenu simple, aucune interaction avec vos clients. Vous dépendez d\'un prestataire pour changer trois mots.',
    answer: 'On conçoit des plateformes administrables et fonctionnelles — emailing intégré, espaces clients, réservations, gestion de contenu. Votre site devient un outil, pas une carte de visite.',
  },
  {
    title: 'Vos processus internes tournent à l\'ancienne.',
    body: 'Excel, emails en chaîne, post-its, fichiers perdus — chaque process manuel est du temps et de l\'argent qui s\'évapore. Et quand ça grossit, ça se casse.',
    answer: 'On développe des outils métier sur-mesure — SaaS interne, gestion RH, suivi de projets, workflows automatisés. Ce qui prend des heures aujourd\'hui prend des secondes demain.',
  },
  {
    title: 'Vous pilotez à l\'aveugle.',
    body: 'Ventes, fréquentation, performances — vous avez des données mais elles sont éparpillées, illisibles, inexploitées. Les décisions se prennent au feeling plutôt qu\'aux faits.',
    answer: 'On construit des tableaux de bord sur-mesure qui centralisent vos indicateurs clés en temps réel. Vous voyez ce qui marche, ce qui bloque, et où agir.',
  },
  {
    title: 'L\'IA, vous en entendez parler — mais pas pour vous.',
    body: 'ChatGPT, automatisations, agents IA — ça semble loin de votre quotidien. Pourtant vos concurrents l\'adoptent, et l\'écart se creuse chaque mois.',
    answer: 'On intègre l\'IA directement dans vos outils métier — agents qui répondent, trient, relancent ou analysent. Pas de la technologie pour la technologie : de l\'IA qui résout vos vrais problèmes.',
  },
]

const pillarsStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const pillarsCard = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

function PillarCard({ pillar }) {
  const cardRef = useRef(null)

  useEffect(() => attachTilt(cardRef.current, { max: 6, lift: 1.01 }), [])

  return (
    <motion.div className="pillar-item" ref={cardRef} variants={pillarsCard}>
      <span className="spotlight" aria-hidden="true" />
      <h3 className="pillar-title">{pillar.title}</h3>
      <p className="pillar-body">{pillar.body}</p>
      <div className="pillar-answer">
        <span className="pillar-answer-arrow" aria-hidden="true">→</span>
        <p>{pillar.answer}</p>
      </div>
    </motion.div>
  )
}

export default function Pillars() {
  return (
    <section className="pillars section" id="pillars">
      <div className="container">
        <div className="pillars-header">
          <motion.span
            className="section-label section-label-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, amount: 0.4 }}
          >
            Transformation
          </motion.span>
          <motion.h2
            className="section-title section-title-light pillars-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
            viewport={{ once: true, amount: 0.4 }}
          >
            La vague digitale qui transforme votre business
          </motion.h2>
          <motion.p
            className="section-subtitle section-subtitle-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
            viewport={{ once: true, amount: 0.4 }}
          >
            La plupart des entreprises n'ont pas un problème de travail — elles ont un problème d'outils.
            On part de vos blocages réels, et on construit ce qui les résout.
          </motion.p>
        </div>

        <motion.div
          className="pillars-grid"
          variants={pillarsStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {pillars.map((p, i) => (
            <PillarCard key={i} pillar={p} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
