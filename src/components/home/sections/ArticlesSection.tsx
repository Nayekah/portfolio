import { FiArrowUpRight } from 'react-icons/fi'
import { articleCards } from '../../../content/blogs'
import { RevealBlock, StaggerGroup, StaggerItem } from '../home-primitives'
import { getArticleHref, renderTagLabel } from '../home-utils'

function ArticlesSection() {
  return (
    <section className="section articles-section" id="blogs">
      <div className="section-divider"></div>
      <div id="write-ups" className="anchor-target"></div>
      <RevealBlock className="section-head">
        <div>
          <h2>Learn about the work from the notes.</h2>
          <p className="section-summary">
            Essays, project pages, write-ups, and research fragments collected in one place.
          </p>
        </div>
        <a className="button-outline" href="/blogs">
          View all articles
        </a>
      </RevealBlock>

      <StaggerGroup className="article-grid" stagger={0.1}>
        {articleCards.map((article) => (
          <StaggerItem key={article.title}>
            {getArticleHref(article) ? (
              <a
                className="article-card article-card-link"
                href={getArticleHref(article) ?? undefined}
              >
                <div
                  className={`article-cover tone-${article.tone}${
                    article.coverImage ? ' article-cover-with-image' : ''
                  }`}
                >
                  {article.coverImage ? (
                    <img
                      className="article-cover-image"
                      src={article.coverImage}
                      alt={article.coverAlt ?? ''}
                      loading="lazy"
                    />
                  ) : null}
                  <div
                    className={`article-cover-inner${
                      article.hideCoverContent ? ' article-cover-inner-empty' : ''
                    }`}
                  >
                    {!article.hideCoverContent ? (
                      <>
                        <strong>{article.title}</strong>
                        <span>{article.body}</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="article-meta-row">
                  <span>{article.meta}</span>
                  <span className="meta-sep">&bull;</span>
                  <span>{article.date}</span>
                  <div className="article-tags" aria-label="Tags">
                    {article.tags.map((tag) => (
                      <span className="article-tag" key={tag}>
                        {renderTagLabel(tag)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="article-title-row">
                  <h3>{article.title}</h3>
                  <span
                    className={`article-link${
                      article.linkVariant === 'reference' ? ' article-link-reference' : ''
                    }`}
                    aria-hidden="true"
                  >
                    {article.linkVariant === 'reference' ? <FiArrowUpRight /> : '?'}
                  </span>
                </div>

                <p>{article.body}</p>
              </a>
            ) : (
              <article className="article-card">
                <div
                  className={`article-cover tone-${article.tone}${
                    article.coverImage ? ' article-cover-with-image' : ''
                  }`}
                >
                  {article.coverImage ? (
                    <img
                      className="article-cover-image"
                      src={article.coverImage}
                      alt={article.coverAlt ?? ''}
                      loading="lazy"
                    />
                  ) : null}
                  <div
                    className={`article-cover-inner${
                      article.hideCoverContent ? ' article-cover-inner-empty' : ''
                    }`}
                  >
                    {!article.hideCoverContent ? (
                      <>
                        <strong>{article.title}</strong>
                        <span>{article.body}</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="article-meta-row">
                  <span>{article.meta}</span>
                  <span className="meta-sep">&bull;</span>
                  <span>{article.date}</span>
                  <div className="article-tags" aria-label="Tags">
                    {article.tags.map((tag) => (
                      <span className="article-tag" key={tag}>
                        {renderTagLabel(tag)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="article-title-row">
                  <h3>{article.title}</h3>
                  <a
                    className={`article-link${
                      article.linkVariant === 'reference' ? ' article-link-reference' : ''
                    }`}
                    href={article.linkHref ?? '#contact'}
                    aria-label={
                      article.linkVariant === 'reference'
                        ? `Open reference for ${article.title}`
                        : undefined
                    }
                  >
                    {article.linkVariant === 'reference' ? <FiArrowUpRight /> : '?'}
                  </a>
                </div>

                <p>{article.body}</p>
              </article>
            )}
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}

export default ArticlesSection
