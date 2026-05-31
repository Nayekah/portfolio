import type { ArticleCard } from '../../types/content'
import type { MetricCellStyle, PatternCell } from './home-primitives'

export function createPattern(seed: number, total = 324): PatternCell[] {
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

export function renderTagLabel(tag: string) {
  return tag.startsWith('#') ? tag : `#${tag}`
}

export function getArticleHref(article: ArticleCard) {
  return article.href ?? article.linkHref ?? null
}

export type { MetricCellStyle }
