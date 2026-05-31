import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, FocusEventHandler, MouseEventHandler, ReactNode } from 'react'
import type { IconType } from 'react-icons'
import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { BsInstagram, BsTwitterX } from 'react-icons/bs'
import { SiCodeforces } from 'react-icons/si'
import {
  useAnimationFrame,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import './App.css'
import { featuredAwards } from './content/awards'
import { articleCards } from './content/blogs'
import { featuredProjects } from './content/projects'
import BlogPage from './components/blogs/BlogPage'
import SiteShell from './components/SiteShell'
import { getCurrentPathname, resolveAppRoute } from './lib/routes'
import AwardsPage from './pages/AwardsPage'
import BlogsPage from './pages/BlogsPage'
import ContactPage from './pages/ContactPage'
import ProjectsPage from './pages/ProjectsPage'
import MiscellaneousPage from './pages/MiscellaneousPage'
import type { FeaturedAward } from './types/content'

type LogoItem = {
  name: string
  logo: string
}

type Metric = {
  number: string
  label: string
  body: string
  tone: string
  seed: number
}

type ValueCard = {
  title: string
  body: string
  tone: string
}

type PatternCell = {
  animate: boolean
  opacity: number
  scale: number
  delay: number
}

type MetricCellStyle = CSSProperties & {
  '--cell-opacity': number
  '--cell-delay': string
  '--cell-scale': number
}

type ValueCardProps = {
  card: ValueCard
  index: number
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

type HeroProfileLink =
  | {
      href: string
      icon: IconType
      label: string
    }
  | {
      custom: 'cryptohack'
      href: string
      label: string
    }

const logoItems: LogoItem[] = [
  { name: 'Solidity', logo: '/tech-icons/solidity.svg' },
  { name: 'Polygon', logo: '/tech-icons/polygon.svg' },
  { name: 'Rust', logo: '/tech-icons/rust.svg' },
  { name: 'Go', logo: '/tech-icons/go.svg' },
  { name: 'Python', logo: '/tech-icons/python.svg' },
  { name: 'TypeScript', logo: '/tech-icons/typescript.svg' },
  { name: 'C', logo: '/tech-icons/c.svg' },
  { name: 'C++', logo: '/tech-icons/cplusplus.svg' },
  { name: 'React', logo: '/tech-icons/react.svg' },
  { name: 'Node.js', logo: '/tech-icons/nodejs.svg' },
  { name: 'FastAPI', logo: '/tech-icons/fastapi.svg' },
  { name: 'PostgreSQL', logo: '/tech-icons/postgresql.svg' },
  { name: 'Docker', logo: '/tech-icons/docker.svg' },
  { name: '.NET', logo: '/tech-icons/dotnetcore.svg' },
  { name: 'Figma', logo: '/tech-icons/figma.svg' },
  { name: 'Notion', logo: '/tech-icons/notion.svg' },
]

const metrics: Metric[] = [
  {
    number: '3',
    label: 'Published papers',
    body: 'Research papers focused on JWT security, lattice-based cryptography, and zero-knowledge proofs (ZKP).',
    tone: 'blue',
    seed: 11,
  },
  {
    number: '20+',
    label: 'Projects built',
    body: 'Hands-on projects across operating systems, game development, web engineering, and crypto-focused builds.',
    tone: 'red',
    seed: 29,
  },
  {
    number: '5+',
    label: 'Awards',
    body: 'National and international competition results across cybersecurity and programming.',
    tone: 'green',
    seed: 47,
  },
]

const valueCards: ValueCard[] = [
  {
    title: 'Software Engineering',
    body: 'Designing and building dependable software systems, from backend services and low-level programming to interfaces that stay structured as they grow.',
    tone: 'mint',
  },
  {
    title: 'Cyber Security',
    body: 'Exploring secure system design, vulnerability research, cryptography, and hands-on offensive practice to better understand how software fails and how it can be defended.',
    tone: 'sand',
  },
  {
    title: 'Machine Learning',
    body: 'Studying how models are trained, evaluated, and applied in practice, with a focus on turning theory into experiments that are useful and reproducible.',
    tone: 'blue',
  },
]

const specializations = [
  [
    'Low-level Programming',
    'System Design',
    'Backend Development',
    'Front-end Development',
  ],
  ['Blockchain Development', 'Cybersecurity', 'Research and Development', 'Cryptography'],
  ['Binary Exploitation', 'Machine Learning', 'Interaction Design', 'Deep Learning'],
]

const heroTypingLine1 = {
  prefix: "Hello, I'm ",
  highlight: 'Nayaka',
  suffix: '!',
}

const heroTypingLine2 = {
  prefix: 'But you can call me ',
  highlight: 'Naye',
  suffix: ' anyway.',
}

const heroProfileLinks: HeroProfileLink[] = [
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
    href: 'mailto:nayakghana39@gmail.com',
    icon: FiMail,
    label: 'Email',
  },
  {
    href: 'https://codeforces.com/profile/w1ntr',
    icon: SiCodeforces,
    label: 'Codeforces',
  },
  {
    href: 'https://www.cryptohack.org/user/K4tou/',
    label: 'CryptoHack',
    custom: 'cryptohack',
  },
]

const siteTitlePrefix = 'Nayaka Ghana Subrata | Security, Systems, and Software Engineer'
const scrambleGlyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+-?'

function createPattern(seed: number, total = 324): PatternCell[] {
  return Array.from({ length: total }, (_, index) => {
    const raw = Math.sin((index + 1) * (seed * 0.917 + 1.731)) * 43758.5453
    const value = raw - Math.floor(raw)
    const bright = value > 0.79
    const medium = value > 0.56
    const animate = bright
    const phase = bright ? 2 : medium ? 1 : 0

    return {
      animate,
      opacity: bright ? 1 : medium ? 0.42 : 0.17,
      scale: bright ? 1 : medium ? 0.86 : 0.72,
      delay: phase * 45 + ((index * 17 + seed * 13) % 6) * 14,
    }
  })
}

function RevealBlock({
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

function StaggerGroup({
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

function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
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

function getTypingDelay(character: string) {
  if (character === ' ') return 38
  if (character === ',') return 145
  if (character === '.') return 110
  return 72
}

function renderTagLabel(tag: string) {
  return tag.startsWith('#') ? tag : `#${tag}`
}

function getArticleHref(article: (typeof articleCards)[number]) {
  return article.href ?? article.linkHref ?? null
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

function ScrambleText({
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

function ValueInterestCard({ card, index }: ValueCardProps) {
  const [isScrambleActive, setIsScrambleActive] = useState(false)

  return (
    <motion.article
      className={`value-card tone-${card.tone}`}
      onViewportEnter={() => setIsScrambleActive(true)}
      viewport={{ once: true, amount: 0.6 }}
    >
      <h3>
        <ScrambleText active={isScrambleActive} settleDelay={22 + index * 4} text={card.title} />
      </h3>
      <p>{card.body}</p>
    </motion.article>
  )
}

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

function TypingHeroTitle() {
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

function TechStackCarousel() {
  const shouldReduceMotion = useReducedMotion() ?? false
  const trackRef = useRef<HTMLDivElement | null>(null)
  const loopWidthRef = useRef(0)
  const currentSpeedRef = useRef(72)
  const [isHovered, setIsHovered] = useState(false)
  const x = useMotionValue(0)

  useEffect(() => {
    const node = trackRef.current

    if (!node) return

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
    if (shouldReduceMotion) return
    if (!loopWidthRef.current) return

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

function HeroPolaroid() {
  const shouldReduceMotion = useReducedMotion() ?? false
  const rotateX = useMotionValue(-5)
  const rotateY = useMotionValue(6)
  const scale = useMotionValue(1)
  const springRotateX = useSpring(rotateX, { stiffness: 180, damping: 18, mass: 0.7 })
  const springRotateY = useSpring(rotateY, { stiffness: 180, damping: 18, mass: 0.7 })
  const springScale = useSpring(scale, { stiffness: 240, damping: 18, mass: 0.7 })
  const transform = useMotionTemplate`perspective(1400px) rotateX(${springRotateX}deg) rotateY(${springRotateY}deg) rotateZ(-2deg) scale(${springScale})`

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return

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
    if (shouldReduceMotion) return
    scale.set(1.018)
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
        <motion.div
          className="hero-profile-card hero-polaroid"
          initial={false}
          style={{ transform }}
        >
          <span className="hero-polaroid-shadow" aria-hidden="true"></span>

          <div className="hero-polaroid-frame">
            <img
              className="hero-profile-image"
              src="/profile.jpeg"
              alt="Nayaka Ghana Subrata portrait"
            />
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
                rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
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

function AwardPolaroidCard({ award }: { award: FeaturedAward }) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const scale = useMotionValue(1)
  const springRotateX = useSpring(rotateX, { stiffness: 180, damping: 18, mass: 0.72 })
  const springRotateY = useSpring(rotateY, { stiffness: 180, damping: 18, mass: 0.72 })
  const springScale = useSpring(scale, { stiffness: 240, damping: 18, mass: 0.7 })
  const transform = useMotionTemplate`perspective(1600px) rotateX(${springRotateX}deg) rotateY(${springRotateY}deg) scale(${springScale})`

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return

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
        if (!shouldReduceMotion) scale.set(1.012)
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

function App() {
  const shouldReduceMotion = useReducedMotion() ?? false
  const [activeMetric, setActiveMetric] = useState(0)
  const [activeAward, setActiveAward] = useState(0)
  const [isMetricAutoplayPaused, setIsMetricAutoplayPaused] = useState(false)
  const [isAwardAutoplayPaused, setIsAwardAutoplayPaused] = useState(false)
  const pathname = getCurrentPathname()
  const year = useMemo(() => new Date().getFullYear(), [])
  const metricPatterns = useMemo(() => metrics.map((metric) => createPattern(metric.seed)), [])
  const currentMetric = metrics[activeMetric]
  const currentAward = featuredAwards[activeAward]
  const activeRoute = useMemo(() => resolveAppRoute(pathname), [pathname])

  useEffect(() => {
    const pageIdentifier =
      activeRoute.type === 'home'
        ? 'Home'
        : activeRoute.type === 'blogs'
          ? 'Blogs'
        : activeRoute.type === 'projects'
          ? 'Projects'
          : activeRoute.type === 'contact'
            ? 'Contacts'
            : activeRoute.type === 'awards'
              ? 'Awards'
            : activeRoute.type === 'miscellaneous'
              ? 'Miscellaneous'
              : `Blog · ${activeRoute.entry.title}`

    document.title = `${siteTitlePrefix} | ${pageIdentifier}`
  }, [activeRoute])

  const previousAward = () => {
    setActiveAward((current) => (current === 0 ? featuredAwards.length - 1 : current - 1))
  }

  const nextAward = () => {
    setActiveAward((current) =>
      current === featuredAwards.length - 1 ? 0 : current + 1
    )
  }

  useEffect(() => {
    if (shouldReduceMotion || isMetricAutoplayPaused || metrics.length < 2) return

    const timer = window.setInterval(() => {
      setActiveMetric((current) => (current === metrics.length - 1 ? 0 : current + 1))
    }, 2600)

    return () => {
      window.clearInterval(timer)
    }
  }, [isMetricAutoplayPaused, shouldReduceMotion])

  useEffect(() => {
    if (shouldReduceMotion || isAwardAutoplayPaused || featuredAwards.length < 2) return

    const timer = window.setInterval(() => {
      setActiveAward((current) =>
        current === featuredAwards.length - 1 ? 0 : current + 1
      )
    }, 3200)

    return () => {
      window.clearInterval(timer)
    }
  }, [isAwardAutoplayPaused, shouldReduceMotion])

  if (activeRoute.type === 'blog') {
    return <BlogPage entry={activeRoute.entry} year={year} />
  }

  if (activeRoute.type === 'contact') {
    return <ContactPage year={year} />
  }

  if (activeRoute.type === 'blogs') {
    return <BlogsPage year={year} />
  }

  if (activeRoute.type === 'projects') {
    return <ProjectsPage year={year} />
  }

  if (activeRoute.type === 'awards') {
    return <AwardsPage year={year} />
  }

  if (activeRoute.type === 'miscellaneous') {
    return <MiscellaneousPage year={year} />
  }

  return (
    <SiteShell isHomePage year={year}>
        <section className="section hero-section">
          <div className="blog-breadcrumbs">
            <span>Main</span>
          </div>

          <div className="hero-simple">
            <RevealBlock className="hero-copy hero-copy-simple" amount={0.5}>
              <TypingHeroTitle />
              <div className="hero-rule"></div>
              <p>
                A third-year Informatics Engineering student at Bandung Institute of Technology,
                passionate about cybersecurity, low-level systems, machine learning, and blockchain
                stuff. I enjoy playing with cryptography, PWN challenges, and blockchain security.
              </p>
              <div className="button-row">
                <a
                  className="button-outline button-with-icon"
                  href="/projects"
                >
                  <FiGithub aria-hidden="true" />
                  <span>View projects</span>
                </a>
                <a
                  className="button-outline button-with-icon"
                  href="https://www.linkedin.com/in/nayaka-ghana-subrata/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FiLinkedin aria-hidden="true" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </RevealBlock>

            <RevealBlock amount={0.45} delay={0.08}>
              <HeroPolaroid />
            </RevealBlock>
          </div>
        </section>

        <section className="section proof-section">
          <div className="section-divider"></div>
          <div className="proof-section-body">
            <RevealBlock className="proof-copy">
              <h2>Tech stack I use.</h2>
              <p>
                This stack reflects the work I spend most of my time on: smart contracts,
                low-level programming, backend systems, security-oriented engineering, and product
                tooling. It is the mix I rely on to build, test, document, and ship technical work
                across both software and blockchain environments.
              </p>
            </RevealBlock>

            <RevealBlock className="stack-carousel-wrap" amount={0.18}>
              <TechStackCarousel />
            </RevealBlock>
          </div>
        </section>

        <section className="section metrics-section">
          <div className="section-divider"></div>
          <RevealBlock className="metrics-head">
            <div>
              <h2>Work that ships.</h2>
              <p>Let the numbers do the talking. A quick snapshot of the work so far:</p>
            </div>
          </RevealBlock>

          <div
            className="metrics-grid"
            onMouseEnter={() => setIsMetricAutoplayPaused(true)}
            onMouseLeave={() => setIsMetricAutoplayPaused(false)}
            onFocusCapture={() => setIsMetricAutoplayPaused(true)}
            onBlurCapture={(event: React.FocusEvent<HTMLDivElement>) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsMetricAutoplayPaused(false)
              }
            }}
          >
            <RevealBlock className="metrics-art" delay={0.04}>
              <div
                className={`metrics-pattern tone-${currentMetric.tone}`}
                key={`pattern-${activeMetric}`}
              >
                {metricPatterns[activeMetric].map((cell, index) => {
                  const style: MetricCellStyle = {
                    '--cell-opacity': cell.opacity,
                    '--cell-delay': `${cell.delay}ms`,
                    '--cell-scale': cell.scale,
                  }

                  return (
                    <span
                      className={cell.animate ? 'is-animated' : undefined}
                      key={`${activeMetric}-${index}`}
                      style={style}
                    ></span>
                  )
                })}
              </div>
            </RevealBlock>

            <RevealBlock className="metrics-list" delay={0.1}>
            <div>
              {metrics.map((metric, index) => (
                <article
                  className={`metric-row${index === activeMetric ? ' is-active' : ' is-inactive'}`}
                  key={metric.label}
                  onMouseEnter={() => setActiveMetric(index)}
                >
                  <div className={`metric-index${index === activeMetric ? ' is-active' : ''}`}>
                    {index + 1}
                  </div>
                  <div className="metric-number">
                    <strong>{metric.number}</strong>
                    <span>{metric.label}</span>
                  </div>
                  <p>{metric.body}</p>
                </article>
              ))}
            </div>
            </RevealBlock>
          </div>
        </section>

        <section className="section awards-section" id="awards">
          <div className="section-divider"></div>
          <RevealBlock className="section-head awards-head">
            <div>
              <h2>Awards and competition highlights.</h2>
              <p className="section-summary">
                Selected milestones from cybersecurity competitions and student technology events.
              </p>
            </div>
            <a className="button-outline" href="/awards">
              View all awards
            </a>
          </RevealBlock>

          <RevealBlock
            className="awards-spotlight"
            onMouseEnter={() => setIsAwardAutoplayPaused(true)}
            onMouseLeave={() => setIsAwardAutoplayPaused(false)}
            onFocusCapture={() => setIsAwardAutoplayPaused(true)}
            onBlurCapture={(event: React.FocusEvent<HTMLDivElement>) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsAwardAutoplayPaused(false)
              }
            }}
          >
            <button className="testimonial-nav" type="button" onClick={previousAward} aria-label="Previous award">
              &larr;
            </button>

            <motion.div
              className="awards-stage"
              key={currentAward.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <AwardPolaroidCard award={currentAward} />
              <div className="award-tabs" aria-label="Award navigation">
                {featuredAwards.map((award, index) => (
                  <button
                    type="button"
                    key={award.title}
                    aria-label={`Show award ${index + 1}: ${award.title}`}
                    aria-pressed={index === activeAward}
                    className={index === activeAward ? 'is-active' : ''}
                    onClick={() => setActiveAward(index)}
                  ></button>
                ))}
              </div>
            </motion.div>

            <button className="testimonial-nav" type="button" onClick={nextAward} aria-label="Next award">
              &rarr;
            </button>
          </RevealBlock>
        </section>

        <section className="section values-section" id="projects">
          <div className="section-divider"></div>
          <RevealBlock className="values-head">
            <h2>Interests.</h2>
          </RevealBlock>

          <StaggerGroup className="value-card-grid">
            {valueCards.map((card, index) => (
              <StaggerItem key={card.title}>
                <ValueInterestCard card={card} index={index} />
              </StaggerItem>
            ))}
          </StaggerGroup>

          <RevealBlock className="specializations-block" id="miscellaneous">
            <h2 className="small-section-title">Related areas I keep exploring</h2>
            <StaggerGroup className="specializations-grid" amount={0.18} stagger={0.08}>
              {specializations.map((column, columnIndex) => (
                <StaggerItem className="specialization-column" key={columnIndex}>
                  {column.map((item) => (
                    <button className="specialization-item" type="button" key={item}>
                      <span>{item}</span>
                    </button>
                  ))}
                </StaggerItem>
              ))}
            </StaggerGroup>
            <a className="button-outline specializations-link" href="/miscellaneous">
              Open miscellaneous
            </a>
          </RevealBlock>
        </section>

        <section className="section featured-work-section">
          <div className="section-divider"></div>
          <div className="featured-work-grid">
            <RevealBlock className="featured-work-copy">
              <h2>Selected projects.</h2>
              <p>
                Two builds that reflect what I spend most of my time on: Convo, a secure messaging
                app, and Keossku Band, a custom operating system built close to the hardware.
              </p>
              <a
                className="button-outline"
                href="/projects"
              >
                Explore the projects
              </a>
            </RevealBlock>

            <StaggerGroup className="featured-card-grid">
              {featuredProjects.map((project) => (
                <StaggerItem key={project.title}>
                  <article className="project-card">
                    <a
                      className={`project-visual tone-${project.tone}`}
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        className="project-image"
                        src={project.image}
                        alt={project.imageAlt}
                        loading="lazy"
                      />
                      <span>{project.subtitle}</span>
                    </a>
                    <div className="project-meta">
                      <span className="project-dot" aria-hidden="true">
                        <FiGithub />
                      </span>
                      <div>
                        <h3>{project.title}</h3>
                        <p>{project.subtitle}</p>
                      </div>
                    </div>
                    <p className="project-description">{project.description}</p>
                    <a
                      className="button-outline button-with-icon project-link"
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FiGithub aria-hidden="true" />
                      <span>View on GitHub</span>
                    </a>
                  </article>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>

        <section className="section articles-section" id="blogs">
          <div className="section-divider"></div>
          <div id="write-ups" className="anchor-target"></div>
          <RevealBlock className="section-head">
            <div>
              <h2>Learn about the work from the notes.</h2>
              <p className="section-summary">
                Essays, project pages, write-ups, and research fragments collected in one place.
              </p>
            </div>
            <a className="button-outline" href="/blogs">
              View all articles
            </a>
          </RevealBlock>

          <StaggerGroup className="article-grid" stagger={0.1}>
            {articleCards.map((article) => (
              <StaggerItem key={article.title}>
                {getArticleHref(article) ? (
                  <a className="article-card article-card-link" href={getArticleHref(article) ?? undefined}>
                    <div
                      className={`article-cover tone-${article.tone}${
                        article.coverImage ? ' article-cover-with-image' : ''
                      }`}
                    >
                      {article.coverImage ? (
                        <img
                          className="article-cover-image"
                          src={article.coverImage}
                          alt={article.coverAlt ?? ''}
                          loading="lazy"
                        />
                      ) : null}
                      <div
                        className={`article-cover-inner${
                          article.hideCoverContent ? ' article-cover-inner-empty' : ''
                        }`}
                      >
                        {!article.hideCoverContent ? (
                          <>
                            <strong>{article.title}</strong>
                            <span>{article.body}</span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="article-meta-row">
                      <span>{article.meta}</span>
                      <span className="meta-sep">&bull;</span>
                      <span>{article.date}</span>
                      <div className="article-tags" aria-label="Tags">
                        {article.tags.map((tag) => (
                          <span className="article-tag" key={tag}>
                            {renderTagLabel(tag)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="article-title-row">
                      <h3>{article.title}</h3>
                      <span
                        className={`article-link${
                          article.linkVariant === 'reference' ? ' article-link-reference' : ''
                        }`}
                        aria-hidden="true"
                      >
                        {article.linkVariant === 'reference' ? <FiArrowUpRight /> : '?'}
                      </span>
                    </div>

                    <p>{article.body}</p>
                  </a>
                ) : (
                  <article className="article-card">
                    <div
                      className={`article-cover tone-${article.tone}${
                        article.coverImage ? ' article-cover-with-image' : ''
                      }`}
                    >
                      {article.coverImage ? (
                        <img
                          className="article-cover-image"
                          src={article.coverImage}
                          alt={article.coverAlt ?? ''}
                          loading="lazy"
                        />
                      ) : null}
                      <div
                        className={`article-cover-inner${
                          article.hideCoverContent ? ' article-cover-inner-empty' : ''
                        }`}
                      >
                        {!article.hideCoverContent ? (
                          <>
                            <strong>{article.title}</strong>
                            <span>{article.body}</span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="article-meta-row">
                      <span>{article.meta}</span>
                      <span className="meta-sep">&bull;</span>
                      <span>{article.date}</span>
                      <div className="article-tags" aria-label="Tags">
                        {article.tags.map((tag) => (
                          <span className="article-tag" key={tag}>
                            {renderTagLabel(tag)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="article-title-row">
                      <h3>{article.title}</h3>
                      <a
                        className={`article-link${
                          article.linkVariant === 'reference' ? ' article-link-reference' : ''
                        }`}
                        href={article.linkHref ?? '#contact'}
                        aria-label={
                          article.linkVariant === 'reference'
                            ? `Open reference for ${article.title}`
                            : undefined
                        }
                      >
                        {article.linkVariant === 'reference' ? <FiArrowUpRight /> : '?'}
                      </a>
                    </div>

                    <p>{article.body}</p>
                  </article>
                )}
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>

        <section className="section closing-section" id="contact">
          <div className="section-divider"></div>
          <StaggerGroup className="closing-grid">
            <StaggerItem>
              <div className="closing-panel">
                <h2>Build with clarity.</h2>
                <p>
                  I build software too, not just portfolios. If you need a stronger digital
                  presence, a writing archive, or a product interface that feels sharper and more
                  deliberate, this is where the work can begin to take a clearer shape.
                </p>
                <a className="button-solid" href="/contacts">
                  Start a conversation
                </a>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="closing-panel">
                <h2>See how I build.</h2>
                <p>
                  I build editorial portfolios, developer-facing interfaces, and systems that turn
                  scattered ideas into something coherent, usable, and ready to publish.
                </p>
                <a className="button-outline" href="/projects">
                  See selected work
                </a>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </section>
    </SiteShell>
  )
}

export default App




