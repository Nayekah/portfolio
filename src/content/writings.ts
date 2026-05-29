import type { WritingEntry } from '../types/content'

const writingEntries: WritingEntry[] = [
  {
    publishedAt: '2025-05-01',
    dateLabel: 'May 2025',
    title:
      'Analyzing Deterministic Randomness in Mersenne Twister Vulnerabilities Using Dynamic Programming in Fiat-Shamir Based Blockchain Protocols',
    summary:
      'A strategy-and-algorithms paper examining how deterministic PRNG behavior can weaken Fiat-Shamir-style blockchain protocols, and how dynamic programming plus ZKP-based defenses can improve resilience.',
    course: 'IF2211 Strategy and Algorithms',
    href: 'https://informatika.stei.itb.ac.id/~rinaldi.munir/Stmik/2024-2025/Makalah2025/Makalah-IF2211-Strategi-Algoritma-2025%20(50).pdf',
  },
  {
    publishedAt: '2025-01-08',
    dateLabel: 'January 2025',
    title:
      "Application of RSA Cryptosystem and Linear Congruential Generator to Enhance Security in JSON Web Tokens for Storing User's Credentials",
    summary:
      'A discrete mathematics paper on strengthening JWT credential storage by combining RSA-based protection with LCG-generated randomness inside the token workflow.',
    course: 'IF1220 Discrete Mathematics',
    href: 'https://informatika.stei.itb.ac.id/~rinaldi.munir/Matdis/2024-2025/Makalah/Makalah-IF1220-Matdis-2024%20(48).pdf',
  },
  {
    publishedAt: '2025-01-02',
    dateLabel: 'January 2025',
    title:
      "Application of the Lenstra-Lenstra-Lovasz (LLL) Lattice Basis Reduction Algorithm and Minkowski's Theorem to Optimize Small Private Key RSA Decryption",
    summary:
      'A linear algebra and geometry paper exploring LLL reduction and Minkowski-based reasoning for attacking or optimizing small-private-key RSA decryption scenarios.',
    course: 'IF2123 Linear Algebra and Geometry',
    href: 'https://informatika.stei.itb.ac.id/~rinaldi.munir/AljabarGeometri/2024-2025/Makalah/Makalah-IF2123-Algeo-2024%20(38).pdf',
  },
]

export const allWritings = [...writingEntries].sort((left, right) =>
  right.publishedAt.localeCompare(left.publishedAt)
)
