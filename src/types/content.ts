export type NavItem = {
  href: string
  label: string
}

export type FooterLink = {
  href: string
  label: string
  external?: boolean
}

export type FooterColumn = {
  heading: string
  links: FooterLink[]
}

export type ArticleCard = {
  tags: string[]
  coverAlt?: string
  coverImage?: string
  href?: string
  linkHref?: string
  meta: string
  date: string
  publishedAt?: string
  title: string
  body: string
  tone: string
  hideCoverContent?: boolean
  linkVariant?: 'default' | 'reference'
}

export type BlogEntry = {
  assets?: Record<string, string>
  slug: string
  tags: string[]
  cardBody: string
  cardTitle: string
  date: string
  markdown: string
  meta: string
  summary: string
  title: string
}

export type ProjectEntry = {
  category: string
  date: string
  title: string
  subtitle: string
  description: string
  overview: string
  buildNotes: string
  stack: string[]
  href: string
  image: string
  imageAlt: string
  tone: string
}

export type WritingEntry = {
  publishedAt: string
  dateLabel: string
  title: string
  summary: string
  course: string
  href: string
}

export type FeaturedAward = {
  category: string
  date: string
  title: string
  body: string
  image: string
  imageAlt: string
}

export type AwardTimelineEntry = {
  scope: string
  title: string
  organization: string
  year: string
  summary: string
  image: string
  imageAlt: string
  polaroidLabel: string
}

export type EducationEntry = {
  label: string
  institution: string
  degree: string
  timeframe: string
  country: string
}

export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; depth: 2 | 3; id: string; text: string }
  | { type: 'blockquote'; text: string }
  | { type: 'figure'; alt: string; caption?: string; src: string }
  | { type: 'code'; code: string; lang: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'equation'; text: string }
  | { type: 'rule' }

export type TocItem = {
  depth: 2 | 3
  id: string
  text: string
}
