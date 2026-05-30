import { useEffect, useMemo, useRef, useState } from 'react'
import 'katex/dist/katex.min.css'
import { getAdjacentBlogEntries } from '../../content/blogs'
import { parseBlogMarkdown, renderInlineMarkdown } from '../../lib/blogs'
import type { BlogEntry } from '../../types/content'
import BlogCodeBlock from './BlogCodeBlock'
import BlogEquation from './BlogEquation'
import SiteShell from '../SiteShell'

type BlogPageProps = {
  entry: BlogEntry
  year: number
}

function BlogPage({ entry, year }: BlogPageProps) {
  const { blocks, toc } = useMemo(() => parseBlogMarkdown(entry.markdown), [entry.markdown])
  const { nextEntry, previousEntry } = useMemo(() => getAdjacentBlogEntries(entry), [entry])
  const [activeTocId, setActiveTocId] = useState<string | null>(toc[0]?.id ?? null)
  const pendingTocIdRef = useRef<string | null>(null)

  const resolveAsset = (src: string) => entry.assets?.[src] ?? src

  useEffect(() => {
    if (!toc.length) {
      return
    }

    const headingElements = toc
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element instanceof HTMLElement)

    if (!headingElements.length) {
      return
    }

    let frameId = 0

    const updateActiveSection = () => {
      const activationLine = window.innerHeight * 0.28
      const targetTopOffset = 112
      const pendingTocId = pendingTocIdRef.current

      if (pendingTocId) {
        const pendingHeading = document.getElementById(pendingTocId)

        if (pendingHeading instanceof HTMLElement) {
          const distanceToTarget = Math.abs(
            pendingHeading.getBoundingClientRect().top - targetTopOffset
          )

          if (distanceToTarget > 28) {
            setActiveTocId((current) => (current === pendingTocId ? current : pendingTocId))
            return
          }
        }

        pendingTocIdRef.current = null
      }

      let nextActiveId = headingElements[0]?.id ?? null

      for (const heading of headingElements) {
        if (heading.getBoundingClientRect().top <= activationLine) {
          nextActiveId = heading.id
        } else {
          break
        }
      }

      setActiveTocId((current) => (current === nextActiveId ? current : nextActiveId))
    }

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(updateActiveSection)
    }

    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [toc])

  return (
    <SiteShell isHomePage={false} mainClassName="blog-page-main" year={year}>
      <section className="section blog-page-section">
        <div className="section-divider"></div>

        <div className="blog-breadcrumbs">
          <a href="/">Main</a>
          <span aria-hidden="true">&rsaquo;</span>
          <a href="/blogs">Blogs</a>
          <span aria-hidden="true">&rsaquo;</span>
          <span>{entry.title}</span>
        </div>

        <div className="blog-layout">
          <aside className="blog-sidebar">
            <div className="blog-toc">
              <h2 className="small-section-title">Table of contents</h2>
              <nav aria-label="Table of contents">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    className={`blog-toc-link depth-${item.depth}${
                      item.id === activeTocId ? ' is-active' : ''
                    }`}
                    href={`#${item.id}`}
                    aria-current={item.id === activeTocId ? 'location' : undefined}
                    onClick={() => {
                      pendingTocIdRef.current = item.id
                      setActiveTocId(item.id)
                    }}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="blog-article">
            <div className="article-meta-row blog-meta-row">
              <span>{entry.meta}</span>
              <span className="meta-sep">&bull;</span>
              <span>{entry.date}</span>
              <span className="article-tag">{entry.category}</span>
            </div>

            <div className="blog-title-divider" aria-hidden="true"></div>
            <h1 className="blog-page-title">{entry.title}</h1>
            {entry.summary ? <p className="blog-page-summary">{entry.summary}</p> : null}

            <div className="blog-content">
              {blocks.map((block, blockIndex) => {
                if (block.type === 'heading') {
                  if (block.depth === 2) {
                    return (
                      <h2 id={block.id} className="blog-section-title" key={`${block.id}-${blockIndex}`}>
                        {block.text}
                      </h2>
                    )
                  }

                  return (
                    <h3 id={block.id} className="blog-subsection-title" key={`${block.id}-${blockIndex}`}>
                      {block.text}
                    </h3>
                  )
                }

                if (block.type === 'paragraph') {
                  return (
                    <p className="blog-paragraph" key={`paragraph-${blockIndex}`}>
                      {renderInlineMarkdown(block.text)}
                    </p>
                  )
                }

                if (block.type === 'blockquote') {
                  return (
                    <blockquote className="blog-quote" key={`quote-${blockIndex}`}>
                      {block.text.split('\n').map((line, lineIndex) => (
                        <p key={`quote-line-${lineIndex}`}>{renderInlineMarkdown(line)}</p>
                      ))}
                    </blockquote>
                  )
                }

                if (block.type === 'figure') {
                  return (
                    <figure className="blog-figure" key={`figure-${blockIndex}`}>
                      <img className="blog-figure-image" src={resolveAsset(block.src)} alt={block.alt} />
                      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
                    </figure>
                  )
                }

                if (block.type === 'code') {
                  return <BlogCodeBlock code={block.code} key={`code-${blockIndex}`} language={block.lang} />
                }

                if (block.type === 'list') {
                  return block.ordered ? (
                    <ol className="blog-list" key={`list-${blockIndex}`}>
                      {block.items.map((item, itemIndex) => (
                        <li key={`list-item-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="blog-list" key={`list-${blockIndex}`}>
                      {block.items.map((item, itemIndex) => (
                        <li key={`list-item-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
                      ))}
                    </ul>
                  )
                }

                if (block.type === 'equation') {
                  return <BlogEquation expression={block.text} key={`equation-${blockIndex}`} />
                }

                return <hr className="blog-rule" key={`rule-${blockIndex}`} />
              })}
            </div>

            {previousEntry || nextEntry ? (
              <nav className="blog-post-nav" aria-label="Post navigation">
                {previousEntry ? (
                  <a className="blog-post-nav-card is-previous" href={`/blogs/${previousEntry.slug}`}>
                    <span className="blog-post-nav-label">Newer Post</span>
                    <strong>{previousEntry.title}</strong>
                  </a>
                ) : null}

                {nextEntry ? (
                  <a className="blog-post-nav-card is-next" href={`/blogs/${nextEntry.slug}`}>
                    <span className="blog-post-nav-label">Older Post</span>
                    <strong>{nextEntry.title}</strong>
                  </a>
                ) : null}
              </nav>
            ) : null}

            <div className="page-back-links">
              <a href="/">Back to home</a>
              <a href="/blogs">Back to blogs</a>
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  )
}

export default BlogPage
