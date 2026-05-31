const SITE_URL = 'https://nayak4.dev'
const SITE_NAME = 'nayak4.dev'
const DEFAULT_IMAGE = `${SITE_URL}/profile.jpeg`
const DEFAULT_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

type JsonLdNode = Record<string, unknown>

export type SeoPayload = {
  description: string
  image?: string
  imageAlt?: string
  jsonLd?: JsonLdNode | JsonLdNode[]
  keywords?: string[]
  pathname: string
  publishedTime?: string
  robots?: string
  title: string
  type?: 'article' | 'profile' | 'website'
}

function getAbsoluteUrl(pathOrUrl?: string) {
  if (!pathOrUrl) {
    return DEFAULT_IMAGE
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl
  }

  return `${SITE_URL}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`
}

function getCanonicalUrl(pathname: string) {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  return `${SITE_URL}${normalizedPath}`
}

function ensureMeta(attribute: 'name' | 'property', value: string) {
  const selector = `meta[${attribute}="${value}"]`
  let element = document.head.querySelector(selector) as HTMLMetaElement | null

  if (!(element instanceof HTMLMetaElement)) {
    element = document.createElement('meta')
    element.setAttribute(attribute, value)
    document.head.appendChild(element)
  }

  return element
}

function ensureLink(rel: string) {
  const selector = `link[rel="${rel}"]`
  let element = document.head.querySelector(selector) as HTMLLinkElement | null

  if (!(element instanceof HTMLLinkElement)) {
    element = document.createElement('link')
    element.rel = rel
    document.head.appendChild(element)
  }

  return element
}

function setMetaContent(attribute: 'name' | 'property', value: string, content: string) {
  const element = ensureMeta(attribute, value)
  element.content = content
}

function removeMeta(attribute: 'name' | 'property', value: string) {
  const element = document.head.querySelector(`meta[${attribute}="${value}"]`)
  element?.parentElement?.removeChild(element)
}

function setJsonLd(payload?: JsonLdNode | JsonLdNode[]) {
  const scriptId = 'route-seo-jsonld'
  const existing = document.getElementById(scriptId)

  if (!payload) {
    existing?.parentElement?.removeChild(existing)
    return
  }

  const script =
    existing instanceof HTMLScriptElement ? existing : document.createElement('script')

  script.id = scriptId
  script.type = 'application/ld+json'
  script.text = JSON.stringify(payload)

  if (!existing) {
    document.head.appendChild(script)
  }
}

export function applySeo(payload: SeoPayload) {
  const canonicalUrl = getCanonicalUrl(payload.pathname)
  const imageUrl = getAbsoluteUrl(payload.image)
  const keywords = payload.keywords?.join(', ')

  document.title = payload.title.includes('Nayaka Ghana Subrata')
    ? payload.title
    : `${payload.title} | Nayaka Ghana Subrata`

  ensureLink('canonical').href = canonicalUrl

  setMetaContent('name', 'description', payload.description)
  setMetaContent('name', 'author', 'Nayaka Ghana Subrata')
  setMetaContent('name', 'robots', payload.robots ?? DEFAULT_ROBOTS)
  setMetaContent('name', 'googlebot', payload.robots ?? DEFAULT_ROBOTS)
  setMetaContent('name', 'application-name', 'Nayaka Ghana Subrata Portfolio')
  setMetaContent('name', 'twitter:card', 'summary_large_image')
  setMetaContent('name', 'twitter:title', payload.title)
  setMetaContent('name', 'twitter:description', payload.description)
  setMetaContent('name', 'twitter:image', imageUrl)
  setMetaContent('name', 'twitter:creator', '@Katounasai')
  setMetaContent('property', 'og:site_name', SITE_NAME)
  setMetaContent('property', 'og:locale', 'en_US')
  setMetaContent('property', 'og:type', payload.type ?? 'website')
  setMetaContent('property', 'og:url', canonicalUrl)
  setMetaContent('property', 'og:title', payload.title)
  setMetaContent('property', 'og:description', payload.description)
  setMetaContent('property', 'og:image', imageUrl)
  setMetaContent('property', 'og:image:alt', payload.imageAlt ?? payload.title)

  if (keywords) {
    setMetaContent('name', 'keywords', keywords)
  } else {
    removeMeta('name', 'keywords')
  }

  if (payload.type === 'article' && payload.publishedTime) {
    setMetaContent('property', 'article:published_time', payload.publishedTime)
  } else {
    removeMeta('property', 'article:published_time')
  }

  setJsonLd(payload.jsonLd)
}

export function getSiteUrl() {
  return SITE_URL
}
