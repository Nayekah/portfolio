import markdown from './content.md?raw'
import image1 from './assets/image1.png'
import image2 from './assets/image2.png'
import image3 from './assets/image3.png'
import image4 from './assets/image4.png'
import image5 from './assets/image5.png'
import image6 from './assets/image6.png'
import image7 from './assets/image7.png'
import image8 from './assets/image8.png'
import image9 from './assets/image9.png'
import image10 from './assets/image10.png'
import image11 from './assets/image11.png'
import image12 from './assets/image12.png'
import image13 from './assets/image13.png'
import image14 from './assets/image14.png'
import type { BlogEntry } from '../../../types/content'

export const mevbotBlog: BlogEntry = {
  assets: {
    'assets/image1.png': image1,
    'assets/image2.png': image2,
    'assets/image3.png': image3,
    'assets/image4.png': image4,
    'assets/image5.png': image5,
    'assets/image6.png': image6,
    'assets/image7.png': image7,
    'assets/image8.png': image8,
    'assets/image9.png': image9,
    'assets/image10.png': image10,
    'assets/image11.png': image11,
    'assets/image12.png': image12,
    'assets/image13.png': image13,
    'assets/image14.png': image14,
  },
  slug: 'mevbot',
  tags: ['Blockchain', 'Reverse'],
  cardBody:
    'Welp, in this blog, I just want to join for the write-ups competitions 😋, special thanks to @hanzceo for making this chall (and the bounty ofc).',
  cardTitle: 'Reversing Blockchain Bytecode',
  date: 'October 1, 2026',
  markdown,
  meta: 'JOINTS CTF 2026',
  summary: '',
  title: 'Reversing Blockchain Bytecode',
}

export { image1 as mevbotCoverImage }
