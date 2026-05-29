import { footerColumns } from '../content/site'
import { resolveInternalHref } from '../lib/navigation'

type SiteFooterProps = {
  isHomePage: boolean
  year: number
}

function SiteFooter({ isHomePage, year }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {footerColumns.map((column) => (
          <div className="footer-column" key={column.heading}>
            <h3>{column.heading}</h3>
            {column.links.map((link) => (
              <a
                key={link.label}
                href={resolveInternalHref(link.href, isHomePage)}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>Nayaka Ghana Subrata &copy; {year}</p>
        <a className="footer-back-top" href="#main-page">
          Back to top
        </a>
      </div>
    </footer>
  )
}

export default SiteFooter
