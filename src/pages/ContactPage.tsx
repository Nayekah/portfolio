import { useEffect, useRef, useState, type ReactNode } from 'react'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { BsInstagram, BsTwitterX } from 'react-icons/bs'
import { motion, useReducedMotion } from 'motion/react'
import ContactForm from '../components/contact/ContactForm'
import SiteShell from '../components/SiteShell'

type ContactPageProps = {
  year: number
}

type TypedLine = {
  prefix: string
  highlight: string
  suffix: string
}

const contactTypingLine: TypedLine = {
  prefix: "Let's build ",
  highlight: '',
  suffix: '',
}

const contactTypingLine2: TypedLine = {
  prefix: 'something ',
  highlight: 'deliberate',
  suffix: '.',
}

const contactChannels = [
  {
    href: 'https://x.com/Katounasai',
    icon: BsTwitterX,
    label: 'X',
  },
  {
    href: 'https://www.instagram.com/nayaka.env',
    icon: BsInstagram,
    label: 'Instagram',
  },
  {
    href: 'https://linkedin.com/in/nayaka-ghana-subrata',
    icon: FiLinkedin,
    label: 'LinkedIn',
  },
  {
    href: 'https://github.com/Nayekah',
    icon: FiGithub,
    label: 'GitHub',
  },
  {
    href: 'mailto:nayakghana39@gmail.com',
    icon: FiMail,
    label: 'Email',
  },
]

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

function TypedContactTitle({ className }: { className: string }) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const line1Text = `${contactTypingLine.prefix}${contactTypingLine.highlight}${contactTypingLine.suffix}`
  const line2Text = `${contactTypingLine2.prefix}${contactTypingLine2.highlight}${contactTypingLine2.suffix}`
  const [line1Chars, setLine1Chars] = useState(shouldReduceMotion ? line1Text.length : 0)
  const [line2Chars, setLine2Chars] = useState(shouldReduceMotion ? line2Text.length : 0)
  const [phase, setPhase] = useState<'idle' | 'line1' | 'pause' | 'line2'>(
    shouldReduceMotion ? 'line2' : 'idle'
  )

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
          setPhase('line1')
          observer.disconnect()
        }
      },
      { threshold: 0.55 }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [shouldReduceMotion])

  useEffect(() => {
    if (shouldReduceMotion) {
      return
    }

    if (phase === 'line1') {
      if (line1Chars === line1Text.length) {
        const pauseTimer = window.setTimeout(() => {
          setPhase('pause')
        }, 620)

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
      }, 420)

      return () => window.clearTimeout(timer)
    }

    if (phase === 'line2') {
      if (line2Chars === line2Text.length) {
        return
      }

      const nextChar = line2Text[line2Chars]
      const timer = window.setTimeout(() => {
        setLine2Chars((current) => current + 1)
      }, getTypingDelay(nextChar))

      return () => window.clearTimeout(timer)
    }
  }, [line1Chars, line1Text, line2Chars, line2Text, phase, shouldReduceMotion])

  const visibleLine1Chars = shouldReduceMotion ? line1Text.length : line1Chars
  const visibleLine2Chars = shouldReduceMotion ? line2Text.length : line2Chars

  return (
    <h1 ref={titleRef} className={className} aria-label={`${line1Text} ${line2Text}`}>
      <span className="typing-line">
        {renderTypedLine(
          contactTypingLine,
          visibleLine1Chars,
          !shouldReduceMotion && (phase === 'line1' || phase === 'pause')
        )}
      </span>
      <span className="typing-line">
        {renderTypedLine(contactTypingLine2, visibleLine2Chars, !shouldReduceMotion && phase === 'line2')}
      </span>
    </h1>
  )
}

function RevealBlock({
  amount = 0.28,
  children,
  className,
  delay = 0,
}: {
  amount?: number
  children: ReactNode
  className?: string
  delay?: number
}) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.72,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

function ContactPage({ year }: ContactPageProps) {
  return (
    <SiteShell isHomePage={false} mainClassName="contact-page-main" year={year}>
      <section className="section contact-page-section">
        <div className="section-divider"></div>

        <div className="blog-breadcrumbs">
          <a href="/">Main</a>
          <span aria-hidden="true">&rsaquo;</span>
          <span>Contacts</span>
        </div>

        <div className="contact-layout">
          <RevealBlock className="contact-copy" amount={0.35}>
            <TypedContactTitle className="contact-title typing-hero-title" />
            <div className="contact-copy-rule"></div>
            <p className="contact-summary">
              If you need a sharper portfolio, a security-aware build, or a technical collaborator
              for research and writing, send the brief here. Keep it concrete and I can respond
              faster.
            </p>

            <div className="contact-channel-list" aria-label="Direct contact links">
              {contactChannels.map((channel) => {
                const Icon = channel.icon

                return (
                  <a
                    className="contact-channel-link"
                    href={channel.href}
                    key={channel.label}
                    aria-label={channel.label}
                    target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={channel.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    title={channel.label}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </RevealBlock>

          <RevealBlock className="contact-form-column" amount={0.22} delay={0.08}>
            <ContactForm />
          </RevealBlock>
        </div>

        <RevealBlock className="page-back-home" amount={0.6} delay={0.12}>
          <a href="/">Back to home</a>
        </RevealBlock>
      </section>
    </SiteShell>
  )
}

export default ContactPage
