import type { PointerEvent as ReactPointerEvent } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import type { FeaturedAward } from '../../types/content'

function AwardPolaroidCard({ award }: { award: FeaturedAward }) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const scale = useMotionValue(1)
  const springRotateX = useSpring(rotateX, { stiffness: 180, damping: 18, mass: 0.72 })
  const springRotateY = useSpring(rotateY, { stiffness: 180, damping: 18, mass: 0.72 })
  const springScale = useSpring(scale, { stiffness: 240, damping: 18, mass: 0.7 })
  const transform = useMotionTemplate`perspective(1600px) rotateX(${springRotateX}deg) rotateY(${springRotateY}deg) scale(${springScale})`

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height

    rotateY.set((x - 0.5) * 10)
    rotateX.set((0.5 - y) * 8)
    scale.set(1.012)
  }

  const resetTilt = () => {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
  }

  return (
    <div
      className="award-polaroid-shell"
      onPointerEnter={() => {
        if (!shouldReduceMotion) {
          scale.set(1.012)
        }
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <motion.article className="award-card award-polaroid" style={{ transform }}>
        <span className="award-polaroid-shadow" aria-hidden="true"></span>

        <div className="award-copy">
          <h3>{award.title}</h3>
          <p>{award.body}</p>
        </div>

        <div className="award-image-wrap">
          <img className="award-image" src={award.image} alt={award.imageAlt} loading="lazy" />
        </div>
      </motion.article>
    </div>
  )
}

export default AwardPolaroidCard
