import type { ProjectEntry } from '../types/content'

const coreProjects: ProjectEntry[] = [
  {
    category: 'Security x Product',
    date: '2026',
    title: 'Convo',
    subtitle: 'Secure messaging app',
    description:
      'An end-to-end encrypted chat app with JWT auth, browser-side ECDH key exchange, AES-secured messaging, and real-time one-to-one conversations.',
    overview:
      'Convo started as an attempt to make the security model visible in the product itself. The app handles authentication, key exchange, and encrypted message delivery without treating the cryptographic layer as an afterthought.',
    buildNotes:
      'The build combines JWT-based identity, browser-side ECDH session agreement, AES-encrypted payloads, and a real-time delivery layer for private one-to-one chat. The goal was to keep the developer experience clean while still exposing the right constraints around key lifecycle and message transport.',
    stack: ['React', 'TypeScript', 'JWT', 'ECDH', 'AES', 'Realtime Messaging'],
    href: 'https://github.com/Nayekah/Convo',
    image: '/projects/convo.png',
    imageAlt: 'Screenshot of the Convo end-to-end encrypted chat application.',
    tone: 'olive',
  },
  {
    category: 'Systems x Low-Level',
    date: '2025',
    title: 'Keossku Band',
    subtitle: 'Custom operating system',
    description:
      'A custom OS in C and x86 Assembly with scheduling, memory management, syscalls, EXT2 support, and low-level drivers running in QEMU.',
    overview:
      'Keossku Band is where the work moves much closer to the hardware. It was built to understand operating system fundamentals from the inside: how processes are scheduled, how memory is managed, and how the kernel exposes a usable system interface.',
    buildNotes:
      'The project includes kernel work in C and x86 Assembly, syscall handling, memory primitives, scheduling, EXT2 filesystem support, and low-level device interaction tested through QEMU. It is the kind of build that forces every abstraction to justify itself.',
    stack: ['C', 'x86 Assembly', 'QEMU', 'Kernel Scheduling', 'Memory Management', 'EXT2'],
    href: 'https://github.com/Nayekah/Keossku-Band',
    image: '/projects/keosskuband.jpeg',
    imageAlt: 'Screenshot of the Keossku Band custom operating system project.',
    tone: 'ink',
  },
]

const sideProjects: ProjectEntry[] = [
  {
    category: 'Security x Multimedia',
    date: '2026',
    title: 'StegVI',
    subtitle: 'Video steganography desktop app',
    description:
      'A desktop steganography application for hiding text or files inside AVI and MP4 video, with sequential or random embedding and optional A5/1 encryption.',
    overview:
      'StegVI was built to explore practical video steganography in a desktop workflow. The core idea is to make payload embedding, extraction, and inspection usable through a GUI while still exposing the underlying tradeoffs around video formats, embedding schemes, and secrecy.',
    buildNotes:
      'The AVI pipeline applies frame-level LSB embedding with multiple schemes such as 3-3-2, 3-2-3, and 2-3-3, while the MP4 path preserves the video stream and stores the payload in the container layer. The application also supports text and file payloads, optional A5/1 encryption, sequential or random embedding modes, and quality metrics including MSE, PSNR, and averaged RGB histograms.',
    stack: ['Java', 'JavaFX', 'JavaCV', 'FFmpeg', 'A5/1', 'LSB Steganography'],
    href: 'https://github.com/Nayekah/StegVI',
    image: '/projects/Stegvi.png',
    imageAlt: 'Screenshot of the StegVI desktop video steganography application.',
    tone: 'dark',
  },
  {
    category: 'Games x Systems',
    date: '2025',
    title: 'Purry Leveling',
    subtitle: 'Strategic RPG dungeon game',
    description:
      'A strategic RPG-based game where players use skills and items to push through a dungeon break with turn-based battle mechanics.',
    overview:
      'Purry Leveling was built as a game project with a stronger systems-programming flavor than a typical web build. It focuses on structuring combat, level progression, and item-driven strategy into a playable dungeon run rather than just a visual prototype.',
    buildNotes:
      'The project is implemented in C++17 and uses SFML for rendering together with ImGui for debugging overlays and interface tooling. The game loop centers on turn-based battles, skill usage, item management, and staged progression across multiple levels, with the build and run flow managed through Make on a Linux-oriented setup.',
    stack: ['C++17', 'SFML', 'ImGui', 'Make', 'Turn-Based Combat', 'Game Systems'],
    href: 'https://github.com/Nayekah/Purry-Leveling',
    image: '/projects/purry-leveling.png',
    imageAlt: 'Screenshot of the Purry Leveling strategic RPG game.',
    tone: 'paper',
  },
  {
    category: 'ML x Foundations',
    date: '2026',
    title: 'Feed-Forward-Neural-Network',
    subtitle: 'FFNN from scratch in Python',
    description:
      'A from-scratch implementation of a feed-forward neural network with configurable layers, activations, loss functions, and gradient-descent training.',
    overview:
      'This project was built to understand neural networks below the convenience layer of high-level frameworks. Instead of treating training as a black box, it focuses on implementing the mechanics directly: weight initialization, forward propagation, backpropagation, and parameter updates.',
    buildNotes:
      'The codebase implements a scikit-learn-like FFNN architecture in Python without relying on high-level deep learning libraries. It includes configurable layer sizes, activation and loss choices, gradient descent optimization, model save/load flows, test coverage, and experiments comparing architectural and hyperparameter choices against reference behavior from scikit-learn models.',
    stack: [
      'Python',
      'NumPy',
      'PyTest',
      'Gradient Descent',
      'Backpropagation',
      'scikit-learn Comparison',
    ],
    href: 'https://github.com/Nayekah/Feed-Forward-Neural-Network',
    image: '/projects/ffnn.webp',
    imageAlt: 'Preview image for the Feed-Forward Neural Network from scratch project.',
    tone: 'blue',
  },
  {
    category: 'Web x Commerce',
    date: '2025',
    title: 'nimonspedia',
    subtitle: 'Marketplace platform',
    description:
      'A web marketplace platform connecting independent sellers and buyers, with product discovery, cart, checkout, store pages, and seller dashboard flows.',
    overview:
      'nimonspedia was built as a full marketplace application rather than a narrow front-end demo. The project covers the buyer and seller sides together: discovery, product details, store management, cart and order flow, and the broader mechanics needed to make a commerce platform feel complete.',
    buildNotes:
      'The codebase mixes a pure PHP and vanilla JavaScript stack with a React plus Node/Express setup, then ties the services together through Docker and Nginx. The implementation includes authentication, search and sorting, checkout, order history, seller dashboards, and deployment-oriented local orchestration with Docker Compose.',
    stack: ['PHP', 'JavaScript', 'React', 'Node.js', 'Express', 'Docker Compose'],
    href: 'https://github.com/Nayekah/nimonspedia',
    image: '/projects/nimonspedia.png',
    imageAlt: 'Screenshot of the nimonspedia marketplace platform.',
    tone: 'light',
  },
  {
    category: 'Compilers x Formal Languages',
    date: '2025',
    title: 'Pascal_C-Compiler',
    subtitle: 'PASCAL-S compiler in Python',
    description:
      'A staged compiler project for PASCAL-S, covering lexical analysis and syntax analysis with a DFA-based lexer and recursive descent parser.',
    overview:
      'Pascal_C-Compiler was built to work through compiler construction directly from formal-language foundations. Instead of stopping at tokenization or theory, the project turns the course material into an executable pipeline that reads PASCAL-S source, analyzes structure, and produces parse output.',
    buildNotes:
      'The implementation is written in Python and develops the compiler incrementally. Early milestones cover deterministic finite automata for lexical analysis, rule-based token generation, and a recursive descent parser that builds and prints a parse tree or AST based on the PASCAL-S grammar. The workflow also includes test inputs and milestone-based execution through a uv-managed environment.',
    stack: ['Python', 'DFA', 'Lexer', 'Recursive Descent Parser', 'AST', 'uv'],
    href: 'https://github.com/Nayekah/Pascal_C-Compiler',
    image: '/projects/pascal.gif',
    imageAlt: 'Animated preview of the Pascal_C-Compiler project.',
    tone: 'sand',
  },
  {
    category: 'Algorithms x NLP',
    date: '2025',
    title: 'TheRecruiter',
    subtitle: 'CV parsing applicant tracker',
    description:
      'A simplified applicant tracking system that parses digital CVs, extracts structured applicant data, and searches content with exact and fuzzy matching.',
    overview:
      'The Recruiter was built as an algorithm-focused application rather than a generic HR dashboard. Its main purpose is to process uploaded CVs, convert them into analyzable text, and help recruitment-style filtering through string matching and structured extraction.',
    buildNotes:
      'The system uses multiple exact string-matching algorithms including Knuth-Morris-Pratt, Boyer-Moore, and Aho-Corasick, then falls back to Levenshtein-based fuzzy matching when exact hits are absent. It also uses regex extraction for CV sections and applicant summaries, with the application managed in Python, containerized with Docker Compose, and configured through a uv-based environment.',
    stack: [
      'Python',
      'KMP',
      'Boyer-Moore',
      'Aho-Corasick',
      'Levenshtein Distance',
      'Docker Compose',
    ],
    href: 'https://github.com/Nayekah/Tubes3_TheRecruiter',
    image: '/projects/TheRecruiterBanner.png',
    imageAlt: 'Banner image for The Recruiter applicant tracking system project.',
    tone: 'mint',
  },
]

export const featuredProjects = coreProjects

export const allProjects: ProjectEntry[] = [...coreProjects, ...sideProjects]
