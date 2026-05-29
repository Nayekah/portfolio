import { useEffect, useState } from 'react'

type NavItem = {
  href: string
  label: string
}

type NavbarProps = {
  isHomePage?: boolean
  navItems: NavItem[]
}

function Navbar({ isHomePage = true, navItems }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const resolveHref = (href: string) => {
    if (href.startsWith('#') && !isHomePage) return `/${href}`
    return href
  }

  useEffect(() => {
    document.body.classList.toggle('nav-open', isMenuOpen)

    return () => {
      document.body.classList.remove('nav-open')
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={`site-header${isMenuOpen ? ' nav-open' : ''}`}>
      <a className="brand" href={isHomePage ? '#main-page' : '/'} onClick={closeMenu}>
        <span className="brand-name">K4</span>
      </a>

      <button
        className="nav-toggle"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="site-nav"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        {isMenuOpen ? 'Close' : 'Menu'}
      </button>

      <nav className="site-nav" id="site-nav" aria-label="Primary">
        {navItems.map((item) => (
          <a key={item.href} href={resolveHref(item.href)} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href="/contacts" onClick={closeMenu}>
        reach me out
      </a>
    </header>
  )
}

export default Navbar
