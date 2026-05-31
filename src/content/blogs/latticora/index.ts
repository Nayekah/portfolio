import markdown from './content.md?raw'
import fb from './assets/first-blood.png'
import fig2 from './assets/fig2.jpg'
import type { BlogEntry } from '../../../types/content'

export const latticoraBlog: BlogEntry = {
  assets: {
    'assets/first-blood.jpg': fb,
    'assets/fig2.jpg': fig2,
  },
  slug: 'latticora',
  tags: ['Cryptography', 'Post-Quantum Cryptography', 'Math'],
  cardBody:
    'An article on turning sparse leakage over the ML-KEM error vector into a full secret recovery, then rebuilding the matching decapsulation key.',
  cardTitle: 'Can We Really Break Post-Quantum Cryptography With Number Theoretic Transform?',
  date: 'May 18, 2026',
  markdown,
  meta: 'Cyber Breaker Competition Promotional 2026',
  summary: '',
  title: 'Can We Really Break Post-Quantum Cryptography With Number Theoretic Transform?',
}
