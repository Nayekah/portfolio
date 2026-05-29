import markdown from './content.md?raw'
import fig2 from './assets/fig2.png'
import fig3 from './assets/fig3.png'
import fig4 from './assets/fig4.png'
import type { BlogEntry } from '../../../types/content'

export const kfuncyBlog: BlogEntry = {
  assets: {
    'assets/fig2.png': fig2,
    'assets/fig3.png': fig3,
    'assets/fig4.png': fig4,
  },
  slug: 'kfuncy',
  category: '#Kernel Pwn',
  cardBody:
    'A Linux kernel challenge where one unchecked function-pointer index is enough to turn a read primitive into commit_creds(init_cred) and gain root.',
  cardTitle: 'Gaining Root Access With Just a Single Function Pointer in Linux Kernel Module',
  date: 'May 27, 2026',
  markdown,
  meta: 'Kernel Exploitation',
  summary: '',
  title: 'Gaining Root Access With Just a Single Function Pointer in Linux Kernel Module',
}
