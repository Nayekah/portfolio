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
          wrapLines
          wrapLongLines
          customStyle={{
            margin: 0,
            padding: '0 1.1rem 1.15rem',
            background: 'transparent',
            fontSize: '0.92rem',
            lineHeight: '1.65',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace",
              whiteSpace: 'inherit',
            },
          }}
          lineProps={{
            style: {
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
            },
          }}
          lineNumberStyle={{
            minWidth: '2.4rem',
            paddingRight: '1rem',
            color: theme === 'dark' ? 'rgba(232, 227, 215, 0.32)' : 'rgba(40, 40, 30, 0.32)',
          }}
        >
          {code}
        </SyntaxHighlighter>
      ) : null}
    </div>
  )
}

export default BlogCodeBlock
