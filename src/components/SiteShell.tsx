import type { ReactNode } from 'react'
import { navItems } from '../content/site'
import Navbar from './Navbar'
import SiteFooter from './SiteFooter'

type SiteShellProps = {
  children: ReactNode
  isHomePage: boolean
  mainClassName?: string
  year: number
}

function SiteShell({ children, isHomePage, mainClassName, year }: SiteShellProps) {
  return (
    <>
      <div id="main-page" className="page-top-anchor" aria-hidden="true"></div>
      <div className="page">
        <Navbar isHomePage={isHomePage} navItems={navItems} />
        <main className={mainClassName}>{children}</main>
      </div>
      <SiteFooter isHomePage={isHomePage} year={year} />
    </>
  )
}

export default SiteShell
