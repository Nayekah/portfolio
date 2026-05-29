import type { FooterColumn, NavItem } from '../types/content'

export const navItems: NavItem[] = [
  { href: '#blogs', label: 'blogs' },
  { href: '#projects', label: 'projects' },
  { href: '#awards', label: 'awards' },
  { href: '#second-brain', label: 'second-brain' },
]

export const footerColumns: FooterColumn[] = [
  {
    heading: 'About me',
    links: [
      { href: '#projects', label: 'Projects' },
      { href: '#awards', label: 'Awards' },
      { href: '/contacts', label: 'Contact' },
    ],
  },
  {
    heading: 'What I do',
    links: [
      { href: '#blogs', label: 'Blogs' },
      { href: '#write-ups', label: 'Write-ups' },
      { href: '#second-brain', label: 'Second-brain' },
    ],
  },
  {
    heading: 'Follow me',
    links: [
      { href: 'https://github.com/', label: 'GitHub', external: true },
      { href: 'https://www.linkedin.com/', label: 'LinkedIn', external: true },
      { href: 'mailto:nayakaghana39@gmail.com', label: 'Email' },
    ],
  },
]
