import type { IconType } from 'react-icons'
import { BsInstagram, BsTwitterX } from 'react-icons/bs'
import { FiMail } from 'react-icons/fi'
import { SiCodeforces } from 'react-icons/si'

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
  ['Low-level Programming', 'System Design', 'Backend Development', 'Front-end Development'],
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
    href: 'mailto:nayakaghana39@gmail.com',
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
const personName = 'Nayaka Ghana Subrata'
const personProfiles = [
  'https://github.com/Nayekah',
  'https://www.linkedin.com/in/nayaka-ghana-subrata/',
  'https://x.com/Katounasai',
  'https://codeforces.com/profile/w1ntr',
  'https://www.cryptohack.org/user/K4tou/',
]

export {
  heroProfileLinks,
  heroTypingLine1,
  heroTypingLine2,
  logoItems,
  metrics,
  personName,
  personProfiles,
  scrambleGlyphs,
  siteTitlePrefix,
  specializations,
  valueCards,
}
export type { HeroProfileLink, LogoItem, Metric, ValueCard }
