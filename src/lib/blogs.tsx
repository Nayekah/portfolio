import katex from 'katex'
import type { ReactNode } from 'react'
import { FiGithub } from 'react-icons/fi'
import type { BlogBlock, TocItem } from '../types/content'

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stripMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}

export function renderInlineMarkdown(text: string) {
  const nodes: ReactNode[] = []
  const pattern =
    /(\{\{github-badge:[^|}]+\|[^}]+\}\}|\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)|!\[[^\]]*\]\([^)]+\)|\$\$[^$]+\$\$|\$[^$\n]+\$|\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0

  for (const match of text.matchAll(pattern)) {
    const [token] = match
    const index = match.index ?? 0

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index))
    }

    if (token.startsWith('{{github-badge:')) {
      const badgeMatch = token.match(/^\{\{github-badge:([^|}]+)\|([^}]+)\}\}$/)
      if (badgeMatch) {
        nodes.push(
          <a
            className="blog-inline-badge"
            href={badgeMatch[2]}
            key={`${index}-github-badge`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="blog-inline-badge-icon" aria-hidden="true">
              <FiGithub />
            </span>
            <span className="blog-inline-badge-label">{badgeMatch[1]}</span>
          </a>,
        )
      }
    } else if (token.startsWith('[![')) {
      const linkedImageMatch = token.match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)$/)
      if (linkedImageMatch) {
        nodes.push(
          <a
            className="blog-inline-image-link"
            href={linkedImageMatch[3]}
            key={`${index}-linked-image`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="blog-inline-image" src={linkedImageMatch[2]} alt={linkedImageMatch[1]} />
          </a>,
        )
      }
    } else if (token.startsWith('![')) {
      const imageMatch = token.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
      if (imageMatch) {
        nodes.push(
          <img
            className="blog-inline-image"
            src={imageMatch[2]}
            alt={imageMatch[1]}
            key={`${index}-image`}
          />,
        )
      }
    } else if (token.startsWith('$$') && token.endsWith('$$')) {
      const expression = token.slice(2, -2).trim()
      const html = katex.renderToString(expression, {
        displayMode: false,
        throwOnError: false,
      })

      nodes.push(
        <span
          className="blog-inline-equation"
          dangerouslySetInnerHTML={{ __html: html }}
          key={`${index}-inline-display-math`}
        />,
      )
    } else if (token.startsWith('$') && token.endsWith('$')) {
      const expression = token.slice(1, -1).trim()
      const html = katex.renderToString(expression, {
        displayMode: false,
        throwOnError: false,
      })

      nodes.push(
        <span
          className="blog-inline-equation"
          dangerouslySetInnerHTML={{ __html: html }}
          key={`${index}-inline-math`}
        />,
      )
    } else if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(<strong key={`${index}-strong`}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(<code key={`${index}-code`}>{token.slice(1, -1)}</code>)
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        nodes.push(
          <a
            key={`${index}-link`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkMatch[1]}
          </a>,
        )
      }
    }

    lastIndex = index + token.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

export function parseBlogMarkdown(markdown: string): { blocks: BlogBlock[]; toc: TocItem[] } {
  const source = markdown.split('\n---\n\n# Agent Instructions:')[0]
  const lines = source.split(/\r?\n/)
  const blocks: BlogBlock[] = []
  const toc: TocItem[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    if (trimmed.startsWith('<figure>')) {
      const srcMatch = trimmed.match(/<img[^>]+src="([^"]+)"/)
      const altMatch = trimmed.match(/<img[^>]+alt="([^"]*)"/)
      const captionMatch = trimmed.match(/<figcaption>(.*?)<\/figcaption>/)

      if (srcMatch) {
        blocks.push({
          type: 'figure',
          alt: altMatch?.[1] ?? '',
          caption: captionMatch?.[1]?.trim() || undefined,
          src: srcMatch[1],
        })
      }

      index += 1
      continue
    }

    if (trimmed === '***' || trimmed === '---') {
      blocks.push({ type: 'rule' })
      index += 1
      continue
    }

    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim()
      index += 1
      const codeLines: string[] = []

      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index])
        index += 1
      }

      blocks.push({ type: 'code', code: codeLines.join('\n'), lang })
      index += 1
      continue
    }

    if (trimmed === '$$') {
      index += 1
      const equationLines: string[] = []

      while (index < lines.length && lines[index].trim() !== '$$') {
        equationLines.push(lines[index])
        index += 1
      }

      blocks.push({ type: 'equation', text: equationLines.join('\n').trim() })
      index += 1
      continue
    }

    if (trimmed.startsWith('### ')) {
      const text = stripMarkdown(trimmed.slice(4).trim())
      const id = slugify(text)
      blocks.push({ type: 'heading', depth: 3, id, text })
      toc.push({ depth: 3, id, text })
      index += 1
      continue
    }

    if (trimmed.startsWith('## ')) {
      const text = stripMarkdown(trimmed.slice(3).trim())
      const id = slugify(text)
      blocks.push({ type: 'heading', depth: 2, id, text })
      toc.push({ depth: 2, id, text })
      index += 1
      continue
    }

    if (trimmed.startsWith('# ')) {
      index += 1
      continue
    }

    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = []

      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''))
        index += 1
      }

      blocks.push({ type: 'blockquote', text: quoteLines.join('\n') })
      continue
    }

    if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const items: string[] = []
      const ordered = /^\d+\.\s+/.test(trimmed)
      const listPattern = ordered ? /^\d+\.\s+/ : /^[-*]\s+/

      while (index < lines.length && listPattern.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(listPattern, ''))
        index += 1
      }

      blocks.push({ type: 'list', items, ordered })
      continue
    }

    const paragraphLines = [trimmed]
    index += 1

    while (index < lines.length) {
      const next = lines[index].trim()
      if (
        !next ||
        next.startsWith('<figure>') ||
        next === '***' ||
        next === '---' ||
        next === '$$' ||
        next.startsWith('```') ||
        next.startsWith('### ') ||
        next.startsWith('## ') ||
        next.startsWith('# ') ||
        next.startsWith('>') ||
        /^[-*]\s+/.test(next) ||
        /^\d+\.\s+/.test(next)
      ) {
        break
      }

      paragraphLines.push(next)
      index += 1
    }

    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') })
  }

  return { blocks, toc }
}
