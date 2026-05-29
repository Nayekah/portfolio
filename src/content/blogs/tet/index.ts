import markdown from './content.md?raw'
import fig2 from './assets/fig2.png'
import fig3 from './assets/fig3.png'
import type { BlogEntry } from '../../../types/content'

export const tetBlog: BlogEntry = {
  assets: {
    'assets/fig2.png': fig2,
    'assets/fig3.png': fig3,
  },
  slug: 'tet',
  category: '#Cryptography',
  cardBody:
    'A general write-up about recovering hidden structure from modular relations, bounded noise, and partial leakage in cryptographic challenges.',
  cardTitle: 'Recovering Structure From a Noisy RSA With Lattice',
  date: 'February 16, 2026',
  markdown,
  meta: 'C2C CTF 2026',
  summary: '',
  title: 'Recovering Structure From a Noisy RSA With Lattice',
}
