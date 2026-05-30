import type { AwardTimelineEntry, EducationEntry, FeaturedAward } from '../types/content'

export const educationRecord: EducationEntry = {
  label: 'Education',
  institution: 'Institut Teknologi Bandung',
  degree: 'B.Sc. in Computer Science',
  timeframe: '2023 - 2027',
  country: 'Indonesia',
}

export const featuredAwards: FeaturedAward[] = [
  {
    category: 'Competitive Programming',
    date: '2025',
    title: 'Honorable Mention - ICPC Asia Jakarta Regional Contest 2025',
    body: 'Received Honorable Mention at the ICPC Asia Jakarta Regional Contest 2025 (International Collegiate Programming Contest).',
    image: '/awards/icpc.jpg',
    imageAlt: 'Team photo from the ICPC Asia Jakarta Regional Contest 2025.',
  },
  {
    category: 'Cybersecurity',
    date: 'Oct 2025',
    title: '2nd Place Hology 8.0 Capture the Flag',
    body: 'Won 2nd place in the Hology 8.0 Capture the Flag competition organized by FILKOM Universitas Brawijaya.',
    image: '/awards/hology.webp',
    imageAlt: 'Team photo receiving 2nd place award at Hology 8.0 Capture the Flag.',
  },
  {
    category: 'Cybersecurity',
    date: 'Oct 2025',
    title: 'Finalist - GEMASTIK XVIII Cyber Security',
    body: 'Reached the finalist stage at GEMASTIK XVIII Cyber Security, organized by the Ministry of Higher Education, Science, and Technology.',
    image: '/awards/gemastikxviii.webp',
    imageAlt: 'Team photo at GEMASTIK XVIII Cyber Security finalist event.',
  },
]

export const awardTimeline: AwardTimelineEntry[] = [
  {
    scope: '[International]',
    title: 'Honorable Mention - ICPC Asia Jakarta Regional Contest 2025',
    organization: 'International Collegiate Programming Contest',
    year: '2025',
    summary:
      'Received Honorable Mention at the ICPC Asia Jakarta Regional Contest 2025 (International Collegiate Programming Contest).',
    image: '/awards/icpc.jpg',
    imageAlt: 'Team photo from the ICPC Asia Jakarta Regional Contest 2025.',
    polaroidLabel: 'ICPC Asia Jakarta 2025',
  },
  {
    scope: '[International]',
    title: '3rd Place - PwnSec CTF 2025',
    organization: 'PwnSec',
    year: '2025',
    summary:
      'Placed 3rd at PwnSec CTF 2025, an international Capture the Flag event, competing with Valgrind as @k4tou.',
    image: '/awards/pwnsec.jpg',
    imageAlt: 'Team photo from PwnSec CTF 2025.',
    polaroidLabel: 'PwnSec CTF 2025',
  },
  {
    scope: '[National]',
    title: 'Finalist - GEMASTIK XVIII Cyber Security',
    organization: 'Kemdiktisaintek',
    year: '2025',
    summary:
      'Reached the finalist stage at GEMASTIK XVIII Cyber Security, organized by the Ministry of Higher Education, Science, and Technology.',
    image: '/awards/gemastikxviii.webp',
    imageAlt: 'Team photo at GEMASTIK XVIII Cyber Security finalist event.',
    polaroidLabel: 'GEMASTIK XVIII Cyber Security',
  },
  {
    scope: '[National]',
    title: '2nd Place Hology 8.0 Capture the Flag',
    organization: 'FILKOM Universitas Brawijaya',
    year: '2025',
    summary:
      'Won 2nd place in the Hology 8.0 Capture the Flag competition organized by FILKOM Universitas Brawijaya.',
    image: '/awards/hology.webp',
    imageAlt: 'Team photo receiving 2nd place award at Hology 8.0 Capture the Flag.',
    polaroidLabel: 'Hology 8.0 CTF',
  },
  {
    scope: '[International]',
    title: '2nd Place - CrewCTF 2025',
    organization: 'TheHackersCrew',
    year: '2025',
    summary:
      'Placed 2nd at CrewCTF 2025, an international Capture the Flag competition, competing with Valgrind as @k4tou.',
    image: '/awards/crewctf.jpg',
    imageAlt: 'Team photo from CrewCTF 2025.',
    polaroidLabel: 'CrewCTF 2025',
  },
  {
    scope: '[National]',
    title: 'Finalist - Recursion 1.0 CTF 2025',
    organization: 'HMIF FT-UH',
    year: '2025',
    summary:
      'Reached the finalist stage at Recursion 1.0 CTF 2025, a national Capture the Flag competition organized by HMIF FT-UH.',
    image: '/awards/recursion.jpg',
    imageAlt: 'Team photo from Recursion 1.0 CTF 2025.',
    polaroidLabel: 'Recursion 1.0 CTF 2025',
  },
  {
    scope: '[National]',
    title: 'Finalist - Slashroot CTF 8.0',
    organization: 'STIKOM Bali',
    year: '2024',
    summary:
      'Reached the finalist stage at Slashroot CTF 8.0, a national Capture the Flag competition organized by STIKOM Bali.',
    image: '/awards/slashroot.jpg',
    imageAlt: 'Team photo from Slashroot CTF 8.0.',
    polaroidLabel: 'Slashroot CTF 8.0',
  },
]
