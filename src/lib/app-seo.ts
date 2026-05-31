import { useEffect } from 'react'
import { awardTimeline } from '../content/awards'
import { articleCards } from '../content/blogs'
import {
  personName,
  personProfiles,
  siteTitlePrefix,
} from '../content/home'
import { allProjects, featuredProjects } from '../content/projects'
import type { AppRoute } from './routes'
import { applySeo, getSiteUrl } from './seo'

const siteUrl = getSiteUrl()

function createBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  }
}

function createPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personName,
    url: `${siteUrl}/`,
    image: `${siteUrl}/profile.jpeg`,
    jobTitle: 'Security-focused Software Engineer',
    email: 'mailto:nayakaghana39@gmail.com',
    sameAs: personProfiles,
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Institut Teknologi Bandung',
    },
  }
}

function useAppSeo(activeRoute: AppRoute, pathname: string) {
  useEffect(() => {
    const normalizedPath = pathname === '/second-brain' ? '/miscellaneous' : pathname
    const personJsonLd = createPersonJsonLd()

    if (activeRoute.type === 'home') {
      applySeo({
        title: siteTitlePrefix,
        description:
          'Portfolio of Nayaka Ghana Subrata, a security-focused software engineer and Informatics student building systems, cryptography projects, research notes, and full-stack products.',
        image: '/profile.jpeg',
        imageAlt: 'Portrait of Nayaka Ghana Subrata',
        keywords: [
          'Nayaka Ghana Subrata',
          'software engineer portfolio',
          'cybersecurity',
          'cryptography',
          'systems programming',
          'full-stack developer',
          'CTF',
          'blockchain',
        ],
        pathname: '/',
        type: 'profile',
        jsonLd: [
          personJsonLd,
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'nayak4.dev',
            url: `${siteUrl}/`,
            author: {
              '@type': 'Person',
              name: personName,
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            name: siteTitlePrefix,
            description:
              'Portfolio homepage for Nayaka Ghana Subrata covering software engineering, cybersecurity, cryptography, research, and selected projects.',
            url: `${siteUrl}/`,
            mainEntity: {
              '@type': 'Person',
              name: personName,
            },
          },
        ],
      })
      return
    }

    if (activeRoute.type === 'projects') {
      applySeo({
        title: 'Projects',
        description:
          'Projects by Nayaka Ghana Subrata across secure messaging, operating systems, steganography, compilers, machine learning, and marketplace engineering.',
        image: featuredProjects[0]?.image,
        imageAlt: featuredProjects[0]?.imageAlt,
        keywords: [
          'software projects',
          'secure messaging app',
          'operating system project',
          'machine learning project',
          'compiler project',
        ],
        pathname: normalizedPath,
        type: 'website',
        jsonLd: [
          personJsonLd,
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Projects', path: '/projects' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Projects',
            url: `${siteUrl}/projects`,
            description:
              'Project archive covering software engineering, systems, security, and machine learning work by Nayaka Ghana Subrata.',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: allProjects.map((project, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'CreativeWork',
                  name: project.title,
                  description: project.description,
                  url: project.href,
                },
              })),
            },
          },
        ],
      })
      return
    }

    if (activeRoute.type === 'blogs') {
      applySeo({
        title: 'Blogs',
        description:
          'Technical blog archive by Nayaka Ghana Subrata with notes on cryptography, post-quantum security, Linux kernel exploitation, and systems research.',
        image: articleCards[0]?.coverImage ?? '/blogs/ntt.png',
        imageAlt: articleCards[0]?.coverAlt ?? 'Technical blog cover image',
        keywords: [
          'technical blog',
          'cryptography write-up',
          'kernel exploitation',
          'post-quantum cryptography',
          'systems research',
        ],
        pathname: normalizedPath,
        type: 'website',
        jsonLd: [
          personJsonLd,
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Blogs', path: '/blogs' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Blogs',
            url: `${siteUrl}/blogs`,
            description:
              'Technical notes and research write-ups by Nayaka Ghana Subrata on cryptography, PWN, and systems.',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: articleCards
                .filter((article) => article.linkHref)
                .map((article, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'BlogPosting',
                    headline: article.title,
                    description: article.body,
                    url: `${siteUrl}${article.linkHref}`,
                  },
                })),
            },
          },
        ],
      })
      return
    }

    if (activeRoute.type === 'contact') {
      applySeo({
        title: 'Contact',
        description:
          'Contact Nayaka Ghana Subrata for software engineering, security-oriented builds, research collaboration, portfolio work, and technical writing.',
        image: '/profile.jpeg',
        imageAlt: 'Portrait of Nayaka Ghana Subrata',
        keywords: [
          'contact Nayaka Ghana Subrata',
          'hire software engineer',
          'security engineer contact',
          'research collaboration',
        ],
        pathname: normalizedPath,
        type: 'website',
        jsonLd: [
          personJsonLd,
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contacts' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Nayaka Ghana Subrata',
            url: `${siteUrl}/contacts`,
            description:
              'Contact page for software engineering, security, research, and writing collaborations.',
            mainEntity: {
              '@type': 'Person',
              name: personName,
              email: 'mailto:nayakaghana39@gmail.com',
              sameAs: personProfiles,
            },
          },
        ],
      })
      return
    }

    if (activeRoute.type === 'awards') {
      applySeo({
        title: 'Awards',
        description:
          'Awards and competition results for Nayaka Ghana Subrata, including ICPC, CTF placements, and cybersecurity competition milestones.',
        image: awardTimeline[0]?.image,
        imageAlt: awardTimeline[0]?.imageAlt,
        keywords: [
          'ICPC',
          'capture the flag awards',
          'cybersecurity competitions',
          'programming competition awards',
        ],
        pathname: normalizedPath,
        type: 'website',
        jsonLd: [
          personJsonLd,
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Awards', path: '/awards' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Awards',
            url: `${siteUrl}/awards`,
            description:
              'Award archive covering programming and cybersecurity competition achievements by Nayaka Ghana Subrata.',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: awardTimeline.map((award, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'CreativeWork',
                  name: award.title,
                  description: award.summary,
                },
              })),
            },
          },
        ],
      })
      return
    }

    if (activeRoute.type === 'miscellaneous') {
      applySeo({
        title: 'Miscellaneous',
        description:
          'A personal miscellany from Nayaka Ghana Subrata, including hobbies, favorite media, listening activity, and notes that sit outside the main project archive.',
        image: '/profile.jpeg',
        imageAlt: 'Portrait of Nayaka Ghana Subrata',
        keywords: [
          'miscellaneous notes',
          'personal interests',
          'Spotify activity',
          'books and movies',
        ],
        pathname: normalizedPath,
        type: 'website',
        jsonLd: [
          personJsonLd,
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Miscellaneous', path: '/miscellaneous' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Miscellaneous',
            url: `${siteUrl}/miscellaneous`,
            description:
              'A personal archive of hobbies, references, media picks, and listening activity by Nayaka Ghana Subrata.',
          },
        ],
      })
      return
    }

    const articleCard = articleCards.find(
      (article) => article.linkHref === `/blogs/${activeRoute.entry.slug}`
    )
    const articleDescription =
      activeRoute.entry.summary ||
      activeRoute.entry.cardBody ||
      articleCard?.body ||
      activeRoute.entry.title
    const articleImage = articleCard?.coverImage ?? '/blogs/ntt.png'
    const articlePublishedTime = articleCard?.publishedAt

    applySeo({
      title: activeRoute.entry.title,
      description: articleDescription,
      image: articleImage,
      imageAlt: articleCard?.coverAlt ?? activeRoute.entry.title,
      keywords: activeRoute.entry.tags,
      pathname: normalizedPath,
      publishedTime: articlePublishedTime,
      type: 'article',
      jsonLd: [
        personJsonLd,
        createBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Blogs', path: '/blogs' },
          { name: activeRoute.entry.title, path: `/blogs/${activeRoute.entry.slug}` },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: activeRoute.entry.title,
          description: articleDescription,
          image: `${siteUrl}${articleImage}`,
          author: {
            '@type': 'Person',
            name: personName,
          },
          publisher: {
            '@type': 'Person',
            name: personName,
          },
          datePublished: articlePublishedTime,
          mainEntityOfPage: `${siteUrl}/blogs/${activeRoute.entry.slug}`,
          keywords: activeRoute.entry.tags.join(', '),
        },
      ],
    })
  }, [activeRoute, pathname])
}

export { useAppSeo }
