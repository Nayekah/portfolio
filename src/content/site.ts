import type { FooterColumn, NavItem } from '../types/content'

export const navItems: NavItem[] = [
  { href: '/blogs', label: 'blogs' },
  { href: '/projects', label: 'projects' },
  { href: '/awards', label: 'awards' },
  { href: '/miscellaneous', label: 'miscellaneous' },
]

export const footerColumns: FooterColumn[] = [
  {
    heading: 'About me',
    links: [
      { href: '/projects', label: 'Projects' },
      { href: '/awards', label: 'Awards' },
      { href: '/contacts', label: 'Contacts' },
    ],
  },
  {
    heading: 'What I do',
    links: [
      { href: '/blogs', label: 'Blogs' },
      { href: '/miscellaneous', label: 'Miscellaneous' },
    ],
  },
  {
    heading: 'Follow me',
    links: [
      { href: 'https://github.com/Nayekah', label: 'GitHub', external: true },
      {
        href: 'https://www.linkedin.com/in/nayaka-ghana-subrata/',
        label: 'LinkedIn',
        external: true,
      },
      { href: 'mailto:nayakaghana39@gmail.com', label: 'Email' },
    ],
  },
]

