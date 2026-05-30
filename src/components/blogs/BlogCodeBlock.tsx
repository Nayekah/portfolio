import { useState } from 'react'
import { FiCheck, FiChevronDown, FiChevronRight, FiCopy } from 'react-icons/fi'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c'
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import { useTheme } from '../theme'

SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('sh', bash)
SyntaxHighlighter.registerLanguage('c', c)
SyntaxHighlighter.registerLanguage('cpp', cpp)
SyntaxHighlighter.registerLanguage('c++', cpp)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('js', javascript)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('markdown', markdown)
SyntaxHighlighter.registerLanguage('md', markdown)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('py', python)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('ts', typescript)

type BlogCodeBlockProps = {
  code: string
  language: string
}

function findWrapPoint(text: string, limit: number) {
  for (let index = limit; index > 0; index -= 1) {
    const character = text[index]

    if (character === ',') {
      return index + 1
    }

    if (character === ' ') {
      return index
    }
  }

  return limit
}

function wrapCodeLine(line: string, maxColumns: number) {
  if (line.length <= maxColumns) {
    return line
  }

  const baseIndent = line.match(/^\s*/)?.[0] ?? ''
  const continuationIndent = `${baseIndent}    `
  const wrappedLines: string[] = []
  let remaining = line.slice(baseIndent.length)
  let currentLimit = Math.max(12, maxColumns - baseIndent.length)

  while (remaining.length > currentLimit) {
    const wrapPoint = findWrapPoint(remaining, currentLimit)
    const segment = remaining.slice(0, wrapPoint).trimEnd()

    wrappedLines.push(
      `${wrappedLines.length === 0 ? baseIndent : continuationIndent}${segment}`
    )

    remaining = remaining.slice(wrapPoint).trimStart()
    currentLimit = Math.max(12, maxColumns - continuationIndent.length)
  }

  wrappedLines.push(
    `${wrappedLines.length === 0 ? baseIndent : continuationIndent}${remaining}`
  )

  return wrappedLines.join('\n')
}

function wrapCodeForDisplay(code: string, maxColumns = 88) {
  return code
    .split('\n')
    .map((line) => wrapCodeLine(line, maxColumns))
    .join('\n')
}

function normalizeLanguage(language: string) {
  const normalized = language.trim().toLowerCase()
  if (!normalized) return 'text'
  if (normalized === 'sage' || normalized === 'sagepython') return 'python'
  return normalized
}

function BlogCodeBlock({ code, language }: BlogCodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const { theme } = useTheme()
  const resolvedLanguage = normalizeLanguage(language)
  const displayCode = wrapCodeForDisplay(code)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      window.setTimeout(() => setIsCopied(false), 1600)
    } catch {
      setIsCopied(false)
    }
  }

  return (
    <div className="blog-code-block">
      <div className="blog-code-toolbar">
        <div className="blog-code-heading">
          <button
            className="blog-code-action"
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse code block' : 'Expand code block'}
            title={isExpanded ? 'Collapse code block' : 'Expand code block'}
          >
            {isExpanded ? (
              <FiChevronDown aria-hidden="true" />
            ) : (
              <FiChevronRight aria-hidden="true" />
            )}
          </button>
          {language ? <span className="blog-code-lang">{language}</span> : <span></span>}
        </div>

        <div className="blog-code-actions">
          <button
            className="blog-code-action"
            type="button"
            onClick={handleCopy}
            aria-label={isCopied ? 'Code copied' : 'Copy code'}
            title={isCopied ? 'Code copied' : 'Copy code'}
          >
            {isCopied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isExpanded ? (
        <SyntaxHighlighter
          language={resolvedLanguage}
          style={theme === 'dark' ? oneDark : oneLight}
          showLineNumbers
          customStyle={{
            margin: 0,
            padding: '0 1.1rem 1.15rem',
            background: 'transparent',
            fontSize: '0.92rem',
            lineHeight: '1.65',
            whiteSpace: 'pre',
            wordBreak: 'normal',
            overflowWrap: 'normal',
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace",
              whiteSpace: 'inherit',
              wordBreak: 'normal',
              overflowWrap: 'normal',
            },
          }}
          lineNumberStyle={{
            minWidth: '2.4rem',
            paddingRight: '1rem',
            color: theme === 'dark' ? 'rgba(232, 227, 215, 0.32)' : 'rgba(40, 40, 30, 0.32)',
          }}
        >
          {displayCode}
        </SyntaxHighlighter>
      ) : null}
    </div>
  )
}

export default BlogCodeBlock
