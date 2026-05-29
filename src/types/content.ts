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
  category: string
  coverAlt?: string
  coverImage?: string
  href?: string
  linkHref?: string
  meta: string
  date: string
  title: string
  body: string
  tone: string
  hideCoverContent?: boolean
  linkVariant?: 'default' | 'reference'
}

export type BlogEntry = {
  assets?: Record<string, string>
  slug: string
  category: string
  cardBody: string
  cardTitle: string
  date: string
  markdown: string
  meta: string
  summary: string
  title: string
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
