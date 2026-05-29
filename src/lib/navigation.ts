export function resolveInternalHref(href: string, isHomePage: boolean) {
  if (href.startsWith('#') && !isHomePage) return `/${href}`
  return href
}
