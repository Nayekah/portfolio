import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { FiArrowUpRight, FiSearch } from 'react-icons/fi'
import { motion, useReducedMotion } from 'motion/react'
import SiteShell from '../components/SiteShell'
import { articleCards } from '../content/blogs'
import type { ArticleCard } from '../types/content'

type BlogsPageProps = {
  year: number
}

type RevealProps = {
  amount?: number
  children: ReactNode
  className?: string
  delay?: number
}

type StaggerProps = {
  'aria-label'?: string
  amount?: number
  children: ReactNode
  className?: string
  delayChildren?: number
  stagger?: number
}

type TypedLine = {
  prefix: string
  highlight: string
  suffix: string
}

const blogsTypingLine: TypedLine = {
  prefix: 'Research and ',
  highlight: 'Notes',
  suffix: '',
}

const INITIAL_VISIBLE_BLOGS = 8

function RevealBlock({ amount = 0.2, children, className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

function StaggerGroup({
  'aria-label': ariaLabel,
  amount = 0.16,
  children,
  className,
  delayChildren = 0,
  stagger = 0.08,
}: StaggerProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      aria-label={ariaLabel}
      className={className}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'show'}
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={{
        hidden: shouldReduceMotion ? {} : { opacity: 0, y: 24 },
        show: shouldReduceMotion
          ? {}
          : {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              },
            },
      }}
    >
      {children}
    </motion.div>
  )
}

function getTypingDelay(character: string) {
  if (character === ' ') return 38
  if (character === ',') return 145
  if (character === '.') return 110
  return 72
}

function renderTypedLine(line: TypedLine, visibleChars: number, showCursor: boolean) {
  const prefixChars = Math.min(visibleChars, line.prefix.length)
  const highlightChars = Math.min(
    Math.max(visibleChars - line.prefix.length, 0),
    line.highlight.length
  )
  const suffixChars = Math.max(visibleChars - line.prefix.length - line.highlight.length, 0)

  return (
    <>
      <span>{line.prefix.slice(0, prefixChars)}</span>
      {highlightChars > 0 && (
        <span className="typing-underline">{line.highlight.slice(0, highlightChars)}</span>
      )}
      <span>{line.suffix.slice(0, suffixChars)}</span>
      {showCursor && <span className="typing-cursor" aria-hidden="true"></span>}
    </>
  )
}

function TypedSectionTitle({ className, line }: { className: string; line: TypedLine }) {
  const shouldReduceMotion = useReducedMotion()
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const fullText = `${line.prefix}${line.highlight}${line.suffix}`
  const [isActive, setIsActive] = useState(shouldReduceMotion)
  const [visibleChars, setVisibleChars] = useState(shouldReduceMotion ? fullText.length : 0)

  useEffect(() => {
    if (shouldReduceMotion) {
      return
    }

    const node = titleRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.55 }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [shouldReduceMotion])

  useEffect(() => {
    if (shouldReduceMotion || !isActive || visibleChars === fullText.length) {
      return
    }

    const nextChar = fullText[visibleChars]
    const timer = window.setTimeout(() => {
      setVisibleChars((current) => current + 1)
    }, getTypingDelay(nextChar))

    return () => window.clearTimeout(timer)
  }, [fullText, isActive, shouldReduceMotion, visibleChars])

  const currentChars = shouldReduceMotion ? fullText.length : visibleChars
  const showCursor = !shouldReduceMotion && isActive

  return (
    <h1 ref={titleRef} className={className} aria-label={fullText}>
      <span className="typing-line">{renderTypedLine(line, currentChars, showCursor)}</span>
    </h1>
  )
}

function getArticleHref(article: ArticleCard) {
  return article.linkHref ?? article.href ?? null
}

function getArticleTimestamp(article: ArticleCard) {
  const source = article.publishedAt ?? article.date
  const parsed = Date.parse(source)
  return Number.isNaN(parsed) ? 0 : parsed
}

function getBulletinCaption(article: ArticleCard) {
  return `${article.meta} · ${article.date}`
}

function ArticleArchiveCard({ article }: { article: ArticleCard }) {
  const href = getArticleHref(article)
  const Wrapper = href ? 'a' : 'article'

  return (
    <Wrapper
      {...(href
        ? {
            href,
            className: 'blogs-archive-card blogs-archive-card-link',
          }
        : {
            className: 'blogs-archive-card',
          })}
    >
      <div
        className={`blogs-archive-card-cover tone-${article.tone}${
          article.coverImage ? ' blogs-archive-card-cover-image' : ''
        }`}
      >
        {article.coverImage ? (
          <img src={article.coverImage} alt={article.coverAlt ?? ''} loading="lazy" />
        ) : (
          <div className="blogs-archive-card-cover-copy">
            <strong>{article.title}</strong>
            <span>{article.body}</span>
          </div>
        )}
      </div>

      <div className="blogs-archive-card-meta">
        <span>{article.meta}</span>
        <span className="meta-sep">&bull;</span>
        <span>{article.date}</span>
        <span className="article-tag">{article.category}</span>
      </div>

      <div className="blogs-archive-card-title-row">
        <h3>{article.title}</h3>
        {href ? (
          <span className="article-link article-link-reference" aria-hidden="true">
            <FiArrowUpRight />
          </span>
        ) : null}
      </div>

      <p>{article.body}</p>
    </Wrapper>
  )
}

function BlogsPage({ year }: BlogsPageProps) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [expandedCounts, setExpandedCounts] = useState<Record<string, number>>({})

  const sortedArticles = useMemo(
    () => [...articleCards].sort((left, right) => getArticleTimestamp(right) - getArticleTimestamp(left)),
    []
  )

  const bulletinArticles = useMemo(() => sortedArticles.slice(0, 4), [sortedArticles])
  const defaultBulletinTitle = bulletinArticles[0]?.title ?? ''
  const [activeBulletinTitle, setActiveBulletinTitle] = useState(defaultBulletinTitle)
  const activeBulletin =
    bulletinArticles.find((article) => article.title === activeBulletinTitle) ?? bulletinArticles[0] ?? null

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search)
    }, 180)

    return () => window.clearTimeout(timer)
  }, [search])

  const filters = useMemo(
    () => ['All', ...Array.from(new Set(sortedArticles.map((article) => article.category)))],
    [sortedArticles]
  )

  const filteredArticles = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase()

    return sortedArticles.filter((article) => {
      const matchesFilter = activeFilter === 'All' || article.category === activeFilter
      if (!matchesFilter) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const haystack = [article.title, article.body, article.meta, article.category]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedSearch)
    })
  }, [activeFilter, debouncedSearch, sortedArticles])

  const filterStateKey = `${activeFilter}::${debouncedSearch.trim().toLowerCase()}`
  const visibleCount = INITIAL_VISIBLE_BLOGS + (expandedCounts[filterStateKey] ?? 0)
  const visibleArticles = filteredArticles.slice(0, visibleCount)
  const hasMoreArticles = filteredArticles.length > visibleCount

  return (
    <SiteShell isHomePage={false} mainClassName="blogs-page-main" year={year}>
      <section className="section blogs-page-section">
        <div className="section-divider"></div>

        <div className="blog-breadcrumbs">
          <a href="/">Main</a>
          <span aria-hidden="true">&rsaquo;</span>
          <span>Blogs</span>
        </div>

        <RevealBlock className="blogs-page-hero" amount={0.35}>
          <div className="blogs-page-headline">
            <TypedSectionTitle className="blogs-page-title typing-section-title" line={blogsTypingLine} />
          </div>

          <div className="blogs-page-intro">
            <p>
              Longer write-ups, research fragments, and technical notes collected into one archive.
              The front of the page carries the newest entries first; below it, the rest can be
              filtered, searched, and expanded as needed.
            </p>
          </div>
        </RevealBlock>

        {activeBulletin ? (
          <RevealBlock amount={0.16}>
            <div
              className="blogs-bulletin-layout"
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setActiveBulletinTitle(defaultBulletinTitle)
                }
              }}
              onMouseLeave={() => {
                setActiveBulletinTitle(defaultBulletinTitle)
              }}
            >
              <div className="blogs-bulletin-feature-shell">
                <article className="blogs-bulletin-feature" aria-label={activeBulletin.title}>
                  <figure className="blogs-bulletin-feature-media">
                    {activeBulletin.coverImage ? (
                      <img src={activeBulletin.coverImage} alt={activeBulletin.coverAlt ?? ''} loading="lazy" />
                    ) : (
                      <div className={`blogs-bulletin-feature-fallback tone-${activeBulletin.tone}`}></div>
                    )}
                    <figcaption>{getBulletinCaption(activeBulletin)}</figcaption>
                  </figure>
                </article>
              </div>

              <div className="blogs-bulletin-list">
                {bulletinArticles.map((article) => {
                  const href = getArticleHref(article)
                  const isActive = article.title === activeBulletin.title

                  if (href) {
                    return (
                      <a
                        className={`blogs-bulletin-entry blogs-bulletin-entry-link${
                          isActive ? ' is-active' : ''
                        }`}
                        href={href}
                        key={`${article.title}-${article.date}`}
                        onFocus={() => {
                          setActiveBulletinTitle(article.title)
                        }}
                        onMouseEnter={() => {
                          setActiveBulletinTitle(article.title)
                        }}
                      >
                        <div className="blogs-bulletin-entry-copy">
                          <h3>{article.title}</h3>
                          <div className="blogs-bulletin-entry-meta">
                            <span>{article.meta}</span>
                            <span className="meta-sep">&bull;</span>
                            <span>{article.date}</span>
                            <span className="article-tag">{article.category}</span>
                          </div>
                        </div>
                        <span className="article-link article-link-reference" aria-hidden="true">
                          <FiArrowUpRight />
                        </span>
                      </a>
                    )
                  }

                  return (
                    <article
                      className={`blogs-bulletin-entry${isActive ? ' is-active' : ''}`}
                      key={`${article.title}-${article.date}`}
                      onMouseEnter={() => {
                        setActiveBulletinTitle(article.title)
                      }}
                    >
                      <div className="blogs-bulletin-entry-copy">
                        <h3>{article.title}</h3>
                        <div className="blogs-bulletin-entry-meta">
                          <span>{article.meta}</span>
                          <span className="meta-sep">&bull;</span>
                          <span>{article.date}</span>
                          <span className="article-tag">{article.category}</span>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </RevealBlock>
        ) : null}

        <RevealBlock className="blogs-archive-head" amount={0.25}>
          <div>
            <h2>All blogs.</h2>
            <p className="section-summary">
              Search the archive, narrow it by tag, then expand the list if more entries match.
            </p>
          </div>
        </RevealBlock>

        <RevealBlock className="blogs-controls" amount={0.18}>
          <label className="blogs-search" htmlFor="blogs-search">
            <FiSearch aria-hidden="true" />
            <input
              id="blogs-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, summary, author, or tag"
            />
          </label>

          <div className="blogs-filter-row" aria-label="Blog filters">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={`blogs-filter-chip${filter === activeFilter ? ' is-active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </RevealBlock>

        <StaggerGroup
          key={`${filterStateKey}::${visibleCount}`}
          className="blogs-archive-grid"
          amount={0.12}
          aria-label="Blog archive"
          delayChildren={0.04}
        >
          {visibleArticles.map((article) => (
            <StaggerItem key={`${article.title}-${article.date}`}>
              <ArticleArchiveCard article={article} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        {!visibleArticles.length ? (
          <RevealBlock className="blogs-empty-state" amount={0.25}>
            <p>No blogs match the current search and filter.</p>
          </RevealBlock>
        ) : null}

        {hasMoreArticles ? (
          <RevealBlock className="blogs-show-more" amount={0.25}>
            <button
              type="button"
              className="button-outline"
              onClick={() =>
                setExpandedCounts((current) => ({
                  ...current,
                  [filterStateKey]: (current[filterStateKey] ?? 0) + INITIAL_VISIBLE_BLOGS,
                }))
              }
            >
              Show more blogs
            </button>
          </RevealBlock>
        ) : null}
      </section>
    </SiteShell>
  )
}

export default BlogsPage
