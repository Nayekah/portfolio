import markdown from './content.md?raw'
import fig2 from './assets/fig2.png'
import fig3 from './assets/fig3.png'
import fig4 from './assets/fig4.png'
import fig5 from './assets/fig5.png'
import type { BlogEntry } from '../../../types/content'

export const kfuncyBlog: BlogEntry = {
  assets: {
    'assets/fig2.png': fig2,
    'assets/fig3.png': fig3,
    'assets/fig4.png': fig4,
    'assets/fig5.png': fig5,
  },
  slug: 'kfuncy',
  tags: ['Kernel', 'PWN'],
  cardBody:
    'A Linux kernel challenge where one unchecked function-pointer index is enough to turn a read primitive into commit_creds(init_cred) and gain root.',
  cardTitle: 'Gaining Root Access With Just a Single Function Pointer in Linux Kernel Module',
  date: 'February 16, 2026',
  markdown,
  meta: 'C2C CTF 2026',
  summary:
    'I spent some time working through this challenge during C2C CTF 2026, and this post records the path from the first inspection of the module to the final privilege-escalation trigger.',
  title: 'Gaining Root Access With Just a Single Function Pointer in Linux Kernel Module',
}
