import { useEffect, useState } from 'react'
import type {
  CSSProperties,
  FocusEventHandler,
  MouseEventHandler,
  ReactNode,
} from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { heroTypingLine1, heroTypingLine2, scrambleGlyphs } from '../../content/home'

export type PatternCell = {
  animate: boolean
  opacity: number
  scale: number
  delay: number
}

export type MetricCellStyle = CSSProperties & {
  '--cell-opacity': number
  '--cell-delay': string
  '--cell-scale': number
}

type RevealProps = {
  amount?: number
  children: ReactNode
  className?: string
  delay?: number
  id?: string
  onBlurCapture?: FocusEventHandler<HTMLDivElement>
  onFocusCapture?: FocusEventHandler<HTMLDivElement>
  onMouseEnter?: MouseEventHandler<HTMLDivElement>
  onMouseLeave?: MouseEventHandler<HTMLDivElement>
}

type StaggerProps = {
  'aria-label'?: string
  amount?: number
  children: ReactNode
  className?: string
  delayChildren?: number
  stagger?: number
}

function getTypingDelay(character: string) {
  if (character === ' ') return 38
  if (character === ',') return 145
  if (character === '.') return 110
  return 72
}

function renderTypedLine(
  line: { prefix: string; highlight: string; suffix: string },
  visibleChars: number,
  showCursor: boolean
) {
  const prefixChars = Math.min(visibleChars, line.prefix.length)
  const highlightChars = Math.min(
    Math.max(visibleChars - line.prefix.length, 0),
    line.highlight.length
  )
  const suffixChars = Math.max(visibleChars - line.prefix.length - line.highlight.length, 0)

  return (
    <>
      <span>{line.prefix.slice(0, prefixChars)}</span>
      {highlightChars > 0 && (
        <span className="typing-underline">{line.highlight.slice(0, highlightChars)}</span>
      )}
      <span>{line.suffix.slice(0, suffixChars)}</span>
      {showCursor && <span className="typing-cursor" aria-hidden="true"></span>}
    </>
  )
}

function getScrambleCharacter(character: string) {
  if (character === ' ') return ' '
  if (/[^A-Za-z0-9]/.test(character)) return character

  return scrambleGlyphs[Math.floor(Math.random() * scrambleGlyphs.length)]
}

export function RevealBlock({
  amount = 0.24,
  children,
  className,
  delay = 0,
  id,
  ...props
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.div
      className={className}
      id={id}
      {...props}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 44 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerGroup({
  'aria-label': ariaLabel,
  amount = 0.2,
  children,
  className,
  delayChildren = 0,
  stagger = 0.12,
}: StaggerProps) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.div
      aria-label={ariaLabel}
      className={className}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'show'}
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.div
      className={className}
      variants={{
        hidden: shouldReduceMotion ? {} : { opacity: 0, y: 32 },
        show: shouldReduceMotion
          ? {}
          : {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              },
            },
      }}
    >
      {children}
    </motion.div>
  )
}

export function ScrambleText({
  active,
  settleDelay = 24,
  text,
}: {
  active: boolean
  settleDelay?: number
  text: string
}) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const [displayText, setDisplayText] = useState(text)
  const resolvedText = shouldReduceMotion || !active ? text : displayText

  useEffect(() => {
    if (shouldReduceMotion || !active) {
      return
    }

    const characters = text.split('')
    let activeIndex = 0
    let scrambleSteps = 0
    let timer = 0

    const tick = () => {
      while (activeIndex < characters.length && characters[activeIndex] === ' ') {
        activeIndex += 1
      }

      if (activeIndex >= characters.length) {
        setDisplayText(text)
        return
      }

      setDisplayText(
        characters
          .map((character, index) => {
            if (index < activeIndex) return character
            if (index > activeIndex) return ' '

            return getScrambleCharacter(character)
          })
          .join('')
      )

      scrambleSteps += 1

      if (scrambleSteps >= 3) {
        scrambleSteps = 0
        activeIndex += 1
      }

      timer = window.setTimeout(tick, settleDelay)
    }

    tick()

    return () => window.clearTimeout(timer)
  }, [active, settleDelay, shouldReduceMotion, text])

  return <>{resolvedText}</>
}

export function TypingHeroTitle() {
  const shouldReduceMotion = useReducedMotion() ?? false
  const line1Text = `${heroTypingLine1.prefix}${heroTypingLine1.highlight}${heroTypingLine1.suffix}`
  const line2Text = `${heroTypingLine2.prefix}${heroTypingLine2.highlight}${heroTypingLine2.suffix}`
  const [line1Chars, setLine1Chars] = useState(shouldReduceMotion ? line1Text.length : 0)
  const [line2Chars, setLine2Chars] = useState(shouldReduceMotion ? line2Text.length : 0)
  const [phase, setPhase] = useState<'line1' | 'pause' | 'line2'>(shouldReduceMotion ? 'line2' : 'line1')

  useEffect(() => {
    if (shouldReduceMotion) {
      return
    }

    if (phase === 'line1') {
      if (line1Chars === line1Text.length) {
        const pauseTimer = window.setTimeout(() => {
          setPhase('pause')
        }, 1600)

        return () => window.clearTimeout(pauseTimer)
      }

      const nextChar = line1Text[line1Chars]
      const timer = window.setTimeout(() => {
        setLine1Chars((current) => current + 1)
      }, getTypingDelay(nextChar))

      return () => window.clearTimeout(timer)
    }

    if (phase === 'pause') {
      const timer = window.setTimeout(() => {
        setPhase('line2')
      }, 1150)

      return () => window.clearTimeout(timer)
    }

    if (line2Chars === line2Text.length) {
      return
    }

    const nextChar = line2Text[line2Chars]
    const timer = window.setTimeout(() => {
      setLine2Chars((current) => current + 1)
    }, getTypingDelay(nextChar))

    return () => window.clearTimeout(timer)
  }, [line1Chars, line1Text, line2Chars, line2Text, phase, shouldReduceMotion])

  const visibleLine1Chars = shouldReduceMotion ? line1Text.length : line1Chars
  const visibleLine2Chars = shouldReduceMotion ? line2Text.length : line2Chars
  const isTypingComplete = shouldReduceMotion || line2Chars === line2Text.length

  return (
    <h1 className="typing-hero-title" aria-label={`${line1Text} ${line2Text}`}>
      <span className="typing-line">
        {renderTypedLine(
          heroTypingLine1,
          visibleLine1Chars,
          !shouldReduceMotion && (phase === 'line1' || phase === 'pause')
        )}
      </span>
      <span className="typing-line">
        {renderTypedLine(
          heroTypingLine2,
          visibleLine2Chars,
          !shouldReduceMotion && (phase === 'line2' || isTypingComplete)
        )}
      </span>
    </h1>
  )
}
