import { useEffect, useRef, useState, type ReactNode } from 'react'
import { FiArrowUpRight } from 'react-icons/fi'
import { motion, useReducedMotion } from 'motion/react'
import SiteShell from '../components/SiteShell'
import { allProjects } from '../content/projects'
import { allWritings } from '../content/writings'

type ProjectsPageProps = {
  year: number
}

type RevealProps = {
  amount?: number
  children: ReactNode
  className?: string
  delay?: number
}

type StaggerProps = {
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

const writingTypingLine: TypedLine = {
  prefix: "What I've ",
  highlight: 'Written',
  suffix: '',
}

const projectsTypingLine: TypedLine = {
  prefix: "What I've ",
  highlight: 'Built',
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
  amount = 0.16,
  children,
  className,
  delayChildren = 0,
  stagger = 0.08,
}: StaggerProps) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.div
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

function ProjectsPage({ year }: ProjectsPageProps) {
  return (
    <SiteShell isHomePage={false} mainClassName="projects-page-main" year={year}>
      <section className="section projects-page-section">
        <div className="section-divider"></div>

        <div className="blog-breadcrumbs">
          <a href="/">Main</a>
          <span aria-hidden="true">&rsaquo;</span>
          <span>Projects</span>
        </div>

        <div id="writings" className="anchor-target"></div>

        <RevealBlock className="writing-page-hero" amount={0.35}>
          <div>
            <TypedSectionTitle
              className="writing-page-title typing-section-title"
              line={writingTypingLine}
            />
          </div>

          <div className="writing-page-intro">
            <p>
              These papers came out of long hours spent following a question until it became clear
              enough to put on the page. Some began as class assignments, but most of them turned
              into a way to think more carefully, argue more precisely, and leave behind a record of
              what the work was trying to understand.
            </p>
          </div>
        </RevealBlock>

        <StaggerGroup className="writing-table" amount={0.14} aria-label="Writing archive">
          <div className="writing-table-head" role="presentation">
            <span>Date</span>
            <span>Paper</span>
            <span>Description</span>
            <span>Course</span>
            <span className="sr-only">Link</span>
          </div>

          {allWritings.map((entry) => (
            <StaggerItem key={entry.href}>
              <article className="writing-row">
                <div className="writing-cell writing-date">{entry.dateLabel}</div>
                <div className="writing-cell writing-title">{entry.title}</div>
                <div className="writing-cell writing-summary">{entry.summary}</div>
                <div className="writing-cell writing-course">{entry.course}</div>
                <div className="writing-cell writing-link">
                  <a href={entry.href} target="_blank" rel="noopener noreferrer">
                    Read
                    <FiArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <RevealBlock className="projects-page-hero" amount={0.3}>
          <div className="projects-page-headline">
            <TypedSectionTitle
              className="projects-page-title typing-section-title"
              line={projectsTypingLine}
            />
          </div>

          <div className="projects-page-intro">
            <p>
              This archive follows the work as it moved from one obsession to another. Some builds
              came from learning how systems fit together, some from testing ideas in security and
              machine learning, and others from trying to ship complete applications. Seen together,
              they feel less like isolated projects and more like a running log of how the technical
              taste kept changing through practice.
            </p>
          </div>
        </RevealBlock>

        <StaggerGroup className="projects-ledger" amount={0.12} aria-label="Project archive">
          {allProjects.map((project) => (
            <StaggerItem key={project.title} className="project-case-shell">
              <article className="project-case">
                <header className="project-case-header">
                  <div className="project-case-meta">
                    <span>{project.category}</span>
                    <span className="meta-sep">&bull;</span>
                    <span>{project.date}</span>
                  </div>
                  <h2 className="project-case-title">
                    {project.title}
                    <span className="project-case-title-muted"> {project.subtitle}</span>
                  </h2>
                </header>

                <div className={`project-case-visual tone-${project.tone}`}>
                  <img src={project.image} alt={project.imageAlt} loading="lazy" />
                </div>

                <div className="project-case-body">
                  <div className="project-case-column">
                    <span className="project-case-label">Summary</span>
                    <p>{project.overview}</p>
                  </div>

                  <div className="project-case-column">
                    <span className="project-case-label">Build notes</span>
                    <p>{project.buildNotes}</p>
                  </div>
                </div>

                <footer className="project-case-footer">
                  <div className="project-case-column project-case-column-stack">
                    <span className="project-case-label">Tech stack</span>
                    <div className="project-stack-list">
                      {project.stack.map((item) => (
                        <span className="project-stack-chip" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="project-case-actions">
                    <a
                      className="project-case-inline-link"
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open on GitHub
                      <FiArrowUpRight aria-hidden="true" />
                    </a>
                  </div>
                </footer>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <RevealBlock className="projects-page-cta" amount={0.6} delay={0.06}>
          <a
            className="button-outline"
            href="https://github.com/Nayekah?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
          >
            See all projects
          </a>
        </RevealBlock>

        <RevealBlock className="projects-page-back-home" amount={0.6} delay={0.1}>
          <a href="/">Back to home</a>
        </RevealBlock>
      </section>
    </SiteShell>
  )
}

export default ProjectsPage
