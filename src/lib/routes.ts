import { getBlogEntryByPath } from '../content/blogs'
import type { BlogEntry } from '../types/content'

type AppRoute =
  | { type: 'home' }
  | { type: 'contact' }
  | { type: 'projects' }
  | { type: 'blog'; entry: BlogEntry }

export function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/'
}

export function getCurrentPathname() {
  if (typeof window === 'undefined') {
    return '/'
  }

  return normalizePathname(window.location.pathname)
}

export function resolveAppRoute(pathname: string): AppRoute {
  const normalizedPathname = normalizePathname(pathname)

  if (normalizedPathname === '/contacts') {
    return { type: 'contact' }
  }

  if (normalizedPathname === '/projects') {
    return { type: 'projects' }
  }

  const blogEntry = getBlogEntryByPath(normalizedPathname)

  if (blogEntry) {
    return { type: 'blog', entry: blogEntry }
  }

  return { type: 'home' }
}
