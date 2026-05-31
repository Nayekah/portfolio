import { useEffect, useRef, useState } from 'react'
import { useAnimationFrame, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { logoItems } from '../../content/home'

function TechStackCarousel() {
  const shouldReduceMotion = useReducedMotion() ?? false
  const trackRef = useRef<HTMLDivElement | null>(null)
  const loopWidthRef = useRef(0)
  const currentSpeedRef = useRef(72)
  const [isHovered, setIsHovered] = useState(false)
  const x = useMotionValue(0)

  useEffect(() => {
    const node = trackRef.current

    if (!node) {
      return
    }

    const updateWidth = () => {
      loopWidthRef.current = node.scrollWidth / 2
    }

    updateWidth()

    const observer = new ResizeObserver(() => {
      updateWidth()
    })

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [])

  useAnimationFrame((_, delta) => {
    if (shouldReduceMotion || !loopWidthRef.current) {
      return
    }

    const targetSpeed = isHovered ? 18 : 72
    const blend = Math.min(1, delta / 220)
    currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * blend

    let nextX = x.get() - currentSpeedRef.current * (delta / 1000)

    if (Math.abs(nextX) >= loopWidthRef.current) {
      nextX += loopWidthRef.current
    }

    x.set(nextX)
  })

  return (
    <div
      className="stack-carousel"
      aria-label="Tools and platforms"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={() => setIsHovered(false)}
    >
      <div className="stack-fade stack-fade-left" aria-hidden="true"></div>
      <div className="stack-fade stack-fade-right" aria-hidden="true"></div>

      <motion.div className="stack-track" ref={trackRef} style={shouldReduceMotion ? undefined : { x }}>
        {[...logoItems, ...logoItems].map((item, index) => {
          const isDuplicate = index >= logoItems.length

          return (
            <div
              className="stack-item"
              key={`${item.name}-${index}`}
              title={item.name}
              aria-label={isDuplicate ? undefined : item.name}
              aria-hidden={isDuplicate ? 'true' : undefined}
            >
              <div className="stack-item-inner">
                <img
                  className="stack-item-logo"
                  src={item.logo}
                  alt={isDuplicate ? '' : `${item.name} logo`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="stack-item-name">{item.name}</span>
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default TechStackCarousel
