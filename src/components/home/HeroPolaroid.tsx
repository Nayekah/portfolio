import type { PointerEvent as ReactPointerEvent } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { heroProfileLinks } from '../../content/home'

function CryptoHackMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M10.3 8.1c-1.2 0-2.2 1-2.2 2.2 0 .5.2 1 .5 1.4-.7.3-1.2 1-1.2 1.8 0 1.2 1 2.2 2.2 2.2.3 0 .6-.1.9-.2.2.9 1 1.5 2 1.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M13.7 8.1c1.2 0 2.2 1 2.2 2.2 0 .5-.2 1-.5 1.4.7.3 1.2 1 1.2 1.8 0 1.2-1 2.2-2.2 2.2-.3 0-.6-.1-.9-.2-.2.9-1 1.5-2 1.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M12 8v9"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <path
        d="M10 10.2c.5.2.8.6.8 1.1 0 .5-.3.9-.8 1.1.5.2.8.6.8 1.1 0 .5-.3.9-.8 1.1M14 10.2c-.5.2-.8.6-.8 1.1 0 .5.3.9.8 1.1-.5.2-.8.6-.8 1.1 0 .5.3.9.8 1.1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function HeroPolaroid() {
  const shouldReduceMotion = useReducedMotion() ?? false
  const rotateX = useMotionValue(-5)
  const rotateY = useMotionValue(6)
  const scale = useMotionValue(1)
  const springRotateX = useSpring(rotateX, { stiffness: 180, damping: 18, mass: 0.7 })
  const springRotateY = useSpring(rotateY, { stiffness: 180, damping: 18, mass: 0.7 })
  const springScale = useSpring(scale, { stiffness: 240, damping: 18, mass: 0.7 })
  const transform = useMotionTemplate`perspective(1400px) rotateX(${springRotateX}deg) rotateY(${springRotateY}deg) rotateZ(-2deg) scale(${springScale})`

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height

    rotateY.set((x - 0.5) * 22)
    rotateX.set((0.5 - y) * 20)
    scale.set(1.018)
  }

  const resetTilt = () => {
    rotateX.set(-5)
    rotateY.set(6)
    scale.set(1)
  }

  const handlePointerEnter = () => {
    if (!shouldReduceMotion) {
      scale.set(1.018)
    }
  }

  return (
    <div className="hero-art hero-art-polaroid">
      <motion.div
        className="hero-polaroid-shell"
        initial={false}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        <motion.div className="hero-profile-card hero-polaroid" initial={false} style={{ transform }}>
          <span className="hero-polaroid-shadow" aria-hidden="true"></span>

          <div className="hero-polaroid-frame">
            <img className="hero-profile-image" src="/profile.jpeg" alt="Nayaka Ghana Subrata portrait" />
          </div>

          <div className="hero-profile-meta hero-polaroid-meta">
            <div className="hero-profile-name">
              <div>
                <h3>Nayaka Ghana Subrata</h3>
              </div>
            </div>
            <span className="hero-polaroid-note">k4tou/w1ntr</span>
          </div>

          <div className="hero-polaroid-links" aria-label="Profile links">
            {heroProfileLinks.map((link) => (
              <a
                className="hero-polaroid-link"
                href={link.href}
                key={link.label}
                aria-label={link.label}
                rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                title={link.label}
              >
                {'icon' in link ? (
                  <link.icon aria-hidden="true" />
                ) : link.custom === 'cryptohack' ? (
                  <CryptoHackMark />
                ) : (
                  <span>{link.label.slice(0, 2)}</span>
                )}
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HeroPolaroid
