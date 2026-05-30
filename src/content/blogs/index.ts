import type { ArticleCard, BlogEntry } from '../../types/content'
import { kfuncyBlog } from './kfuncy'
import { latticoraBlog } from './latticora'
import { tetBlog } from './tet'

export const blogEntries: BlogEntry[] = [latticoraBlog, kfuncyBlog, tetBlog]

export const articleCards: ArticleCard[] = [
  {
    tags: latticoraBlog.tags,
    linkHref: `/blogs/${latticoraBlog.slug}`,
    meta: latticoraBlog.meta,
    date: latticoraBlog.date,
    publishedAt: '2026-05-18',
    title: latticoraBlog.cardTitle,
    body: latticoraBlog.cardBody,
    tone: 'blue',
    coverAlt: 'Number Theoretic Transform illustration for the latticora write-up.',
    coverImage: '/blogs/ntt.png',
    hideCoverContent: true,
    linkVariant: 'reference',
  },
  {
    tags: kfuncyBlog.tags,
    linkHref: `/blogs/${kfuncyBlog.slug}`,
    meta: kfuncyBlog.meta,
    date: kfuncyBlog.date,
    publishedAt: '2026-02-16',
    title: kfuncyBlog.cardTitle,
    body: kfuncyBlog.cardBody,
    tone: 'ink',
    coverAlt: 'Kernel module illustration.',
    coverImage: '/blogs/modules.gif',
    hideCoverContent: true,
    linkVariant: 'reference',
  },
  {
    tags: tetBlog.tags,
    linkHref: `/blogs/${tetBlog.slug}`,
    meta: tetBlog.meta,
    date: tetBlog.date,
    publishedAt: '2026-02-16',
    title: tetBlog.cardTitle,
    body: tetBlog.cardBody,
    tone: 'dark',
    coverAlt: 'Lattice reduction illustration for the noisy RSA write-up.',
    coverImage: '/blogs/lattice.png',
    hideCoverContent: true,
    linkVariant: 'reference',
  },
  {
    tags: ['Projects'],
    meta: 'The Portfolio',
    date: 'September 25, 2025',
    publishedAt: '2025-09-25',
    title: 'Introducing a more editorial front-end',
    body: 'Why a denser, calmer interface creates better reading conditions than a louder, trend-following layout.',
    tone: 'light',
  },
]

export function getBlogEntryByPath(pathname: string) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'
  return blogEntries.find((entry) => normalizedPath === `/blogs/${entry.slug}`)
}

function getBlogEntryTimestamp(entry: BlogEntry) {
  const articleCard = articleCards.find((article) => article.linkHref === `/blogs/${entry.slug}`)
  const source = articleCard?.publishedAt ?? entry.date
  const parsed = Date.parse(source)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function getOrderedBlogEntries() {
  return [...blogEntries].sort(
    (left, right) => getBlogEntryTimestamp(right) - getBlogEntryTimestamp(left)
  )
}

export function getAdjacentBlogEntries(entry: BlogEntry) {
  const orderedEntries = getOrderedBlogEntries()
  const currentIndex = orderedEntries.findIndex((candidate) => candidate.slug === entry.slug)

  if (currentIndex === -1) {
    return {
      previousEntry: null,
      nextEntry: null,
    }
  }

  return {
    previousEntry: orderedEntries[currentIndex - 1] ?? null,
    nextEntry: orderedEntries[currentIndex + 1] ?? null,
  }
}
