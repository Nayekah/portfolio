import type { ArticleCard, BlogEntry } from '../../types/content'
import { kfuncyBlog } from './kfuncy'
import { tetBlog } from './tet'

export const blogEntries: BlogEntry[] = [kfuncyBlog, tetBlog]

export const articleCards: ArticleCard[] = [
  {
    category: kfuncyBlog.category,
    linkHref: `/blogs/${kfuncyBlog.slug}`,
    meta: kfuncyBlog.meta,
    date: kfuncyBlog.date,
    title: kfuncyBlog.cardTitle,
    body: kfuncyBlog.cardBody,
    tone: 'ink',
    coverAlt: 'Kernel module illustration.',
    coverImage: '/blogs/modules.gif',
    hideCoverContent: true,
    linkVariant: 'reference',
  },
  {
    category: tetBlog.category,
    linkHref: `/blogs/${tetBlog.slug}`,
    meta: tetBlog.meta,
    date: tetBlog.date,
    title: tetBlog.cardTitle,
    body: tetBlog.cardBody,
    tone: 'dark',
    coverAlt: 'Lattice reduction illustration for the noisy RSA write-up.',
    coverImage: '/blogs/lattice.png',
    hideCoverContent: true,
    linkVariant: 'reference',
  },
  {
    category: '#Systems',
    meta: 'Lime',
    date: 'February 17, 2026',
    title: 'Inside miscellaneous: notes, tags, and useful friction',
    body: 'Designing a note system that supports writing and product work without becoming overhead.',
    tone: 'paper',
  },
  {
    category: '#Projects',
    meta: 'The Portfolio',
    date: 'September 25, 2025',
    title: 'Introducing a more editorial front-end',
    body: 'Why a denser, calmer interface creates better reading conditions than a louder, trend-following layout.',
    tone: 'light',
  },
]

export function getBlogEntryByPath(pathname: string) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'
  return blogEntries.find((entry) => normalizedPath === `/blogs/${entry.slug}`)
}

