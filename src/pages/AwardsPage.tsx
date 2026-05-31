import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import SiteShell from '../components/SiteShell'
import { awardTimeline, educationRecord } from '../content/awards'

type AwardsPageProps = {
  year: number
}

type RevealProps = {
  amount?: number
  children: ReactNode
  className?: string
  delay?: number
}

type StaggerProps = {
  'aria-label'?: string
  amount?: number
  children: ReactNode
  className?: string
  delayChildren?: number
  stagger?: number
}

type TypedLine = {
  prefix: string
  highlight: string
  suffix: string
}

const awardsTypingLine: TypedLine = {
  prefix: 'Awards and ',
  highlight: 'Honors',
  suffix: '',
}

function RevealBlock({ amount = 0.2, children, className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

function StaggerGroup({
  'aria-label': ariaLabel,
  amount = 0.16,
  children,
  className,
  delayChildren = 0,
  stagger = 0.08,
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

function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.div
      className={className}
      variants={{
        hidden: shouldReduceMotion ? {} : { opacity: 0, y: 24 },
        show: shouldReduceMotion
          ? {}
          : {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              },
            },
      }}
    >
      {children}
    </motion.div>
  )
}

function getTypingDelay(character: string) {
  if (character === ' ') return 38
  if (character === ',') return 145
  if (character === '.') return 110
  return 72
}

function renderTypedLine(line: TypedLine, visibleChars: number, showCursor: boolean) {
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

function TypedSectionTitle({ className, line }: { className: string; line: TypedLine }) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const fullText = `${line.prefix}${line.highlight}${line.suffix}`
  const [isActive, setIsActive] = useState(shouldReduceMotion)
  const [visibleChars, setVisibleChars] = useState(shouldReduceMotion ? fullText.length : 0)

  useEffect(() => {
    if (shouldReduceMotion) {
      return
    }

    const node = titleRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.55 }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [shouldReduceMotion])

  useEffect(() => {
    if (shouldReduceMotion || !isActive || visibleChars === fullText.length) {
      return
    }

    const nextChar = fullText[visibleChars]
    const timer = window.setTimeout(() => {
      setVisibleChars((current) => current + 1)
    }, getTypingDelay(nextChar))

    return () => window.clearTimeout(timer)
  }, [fullText, isActive, shouldReduceMotion, visibleChars])

  const currentChars = shouldReduceMotion ? fullText.length : visibleChars
  const showCursor = !shouldReduceMotion && isActive

  return (
    <h1 ref={titleRef} className={className} aria-label={fullText}>
      <span className="typing-line">{renderTypedLine(line, currentChars, showCursor)}</span>
    </h1>
  )
}

function AwardsPage({ year }: AwardsPageProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const [activeAwardIndex, setActiveAwardIndex] = useState(0)
  const [isPreviewHighlighted, setIsPreviewHighlighted] = useState(false)
  const [isCompactLayout, setIsCompactLayout] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 1200
  )
  const stageRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [polaroidOffset, setPolaroidOffset] = useState(0)
  const activeAward = awardTimeline[activeAwardIndex]
  const floatingPolaroidOffset = isCompactLayout ? 0 : polaroidOffset

  useEffect(() => {
    const updateLayoutMode = () => {
      setIsCompactLayout(window.innerWidth <= 1200)
    }

    updateLayoutMode()
    window.addEventListener('resize', updateLayoutMode)

    return () => window.removeEventListener('resize', updateLayoutMode)
  }, [])

  useEffect(() => {
    if (isCompactLayout) {
      return
    }

    const updateOffset = () => {
      const stage = stageRef.current
      const item = itemRefs.current[activeAwardIndex]

      if (!stage || !item) {
        return
      }

      const stageRect = stage.getBoundingClientRect()
      const itemRect = item.getBoundingClientRect()
      const nextOffset = itemRect.top - stageRect.top + itemRect.height / 2 - 170

      setPolaroidOffset(Math.max(0, nextOffset))
    }

    const frameId = window.requestAnimationFrame(updateOffset)
    window.addEventListener('resize', updateOffset)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', updateOffset)
    }
  }, [activeAwardIndex, isCompactLayout])

  const activateAward = (index: number) => {
    setActiveAwardIndex(index)
    setIsPreviewHighlighted(true)
  }

  const resetPreview = () => {
    setIsPreviewHighlighted(false)
  }

  return (
    <SiteShell isHomePage={false} mainClassName="awards-page-main" year={year}>
      <section className="section awards-page-section">
        <div className="section-divider"></div>

        <div className="blog-breadcrumbs">
          <a href="/">Main</a>
          <span aria-hidden="true">&rsaquo;</span>
          <span>Awards</span>
        </div>

        <RevealBlock className="awards-page-hero" amount={0.35}>
          <div className="awards-page-headline">
            <TypedSectionTitle
              className="awards-page-title typing-section-title"
              line={awardsTypingLine}
            />
          </div>

          <div className="awards-page-intro">
            <p>
              A running archive of competitions, scholarship milestones, and academic recognition.
              The list matters less as a scoreboard than as a record of where the work kept being
              tested in public.
            </p>
          </div>
        </RevealBlock>

        <div className="awards-archive-layout">
          <RevealBlock className="awards-education-panel" amount={0.24}>
            <span className="awards-kicker">{educationRecord.label}</span>
            <h2>{educationRecord.institution}</h2>
            <figure className="awards-education-photo">
              <img
                src="/awards/labtek.jpg"
                alt="Wall of notes and equations inside Labtek at ITB."
                loading="lazy"
              />
              <figcaption>Labtek V, ITB</figcaption>
            </figure>
            <p className="awards-education-degree">{educationRecord.degree}</p>
            <p className="awards-education-meta">
              {educationRecord.timeframe}
              <span aria-hidden="true"> · </span>
              <span>{educationRecord.country}</span>
            </p>
          </RevealBlock>

          <div className="awards-timeline-column">
            <RevealBlock className="awards-timeline-header" amount={0.3}>
              <span className="awards-kicker">Recent awards</span>
            </RevealBlock>

            <div
              ref={stageRef}
              className="awards-timeline-stage"
              onMouseLeave={resetPreview}
              onBlurCapture={(event: React.FocusEvent<HTMLDivElement>) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  resetPreview()
                }
              }}
            >
              <motion.figure
                className={`awards-floating-polaroid${isPreviewHighlighted ? ' is-colorized' : ''}`}
                initial={shouldReduceMotion ? false : { opacity: 0, x: 24, rotate: 3 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0, rotate: -4 }}
                viewport={{ once: true, amount: 0.3 }}
                animate={
                  shouldReduceMotion || isCompactLayout
                    ? undefined
                    : {
                        y: floatingPolaroidOffset,
                        rotate: activeAwardIndex % 2 === 0 ? -4 : 4,
                      }
                }
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="awards-floating-polaroid-inner">
                  <div className="awards-floating-media">
                    <img src={activeAward.image} alt="" loading="lazy" />
                  </div>
                </div>
              </motion.figure>

              <StaggerGroup
                className="awards-timeline-list"
                amount={0.12}
                aria-label="Awards timeline"
                delayChildren={0.04}
              >
                {awardTimeline.map((award, index) => (
                  <StaggerItem key={`${award.title}-${award.year}`}>
                    <button
                      ref={(node) => {
                        itemRefs.current[index] = node
                      }}
                      type="button"
                      className={`awards-timeline-item${
                        index === activeAwardIndex ? ' is-active' : ''
                      }`}
                      onMouseEnter={() => activateAward(index)}
                      onFocus={() => activateAward(index)}
                      onClick={() => activateAward(index)}
                    >
                      <span className="awards-timeline-rail" aria-hidden="true"></span>
                      <span className="awards-timeline-copy">
                        <span className="awards-timeline-title">
                          <span className="awards-timeline-scope">{award.scope}</span>
                          <span>{award.title}</span>
                        </span>
                        <span className="awards-timeline-meta">
                          {award.organization}
                          <span aria-hidden="true"> · </span>
                          <span>{award.year}</span>
                        </span>
                        <span className="awards-timeline-summary">{award.summary}</span>
                      </span>
                    </button>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </div>
        </div>

        <RevealBlock className="page-back-home" amount={0.6} delay={0.1}>
          <a href="/">Back to home</a>
        </RevealBlock>
      </section>
    </SiteShell>
  )
}

export default AwardsPage
