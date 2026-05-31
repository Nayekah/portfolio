import { useEffect, useRef, useState, type ReactNode } from 'react'
import { FiArrowUpRight, FiBookOpen, FiClock, FiCompass, FiFilm } from 'react-icons/fi'
import { SiSpotify } from 'react-icons/si'
import { motion, useReducedMotion } from 'motion/react'
import SiteShell from '../components/SiteShell'
import {
  fetchTopSongs,
  fetchRecentlyPlayedTrack,
  formatPlayedAtLabel,
  type RecentlyPlayedTrack,
  type SpotifyTrackPreview,
} from '../lib/spotify'

const SPOTIFY_REFRESH_INTERVAL_MS = 120_000
const SPOTIFY_FALLBACK_MESSAGE = 'Spotify listening data is temporarily unavailable.'
const SPOTIFY_TOP_SONGS_FALLBACK_MESSAGE = 'Spotify song details are temporarily unavailable.'

type MiscellaneousPageProps = {
  year: number
}

type RevealProps = {
  amount?: number
  children: ReactNode
  className?: string
  delay?: number
}

type StaggerProps = {
  'aria-label'?: string
  amount?: number
  children: ReactNode
  className?: string
  delayChildren?: number
  stagger?: number
}

type TypedLine = {
  prefix: string
  highlight: string
  suffix: string
}

const miscellaneousTypingLine: TypedLine = {
  prefix: 'Inside the ',
  highlight: 'Miscellaneous',
  suffix: '',
}

const hobbies = [
  'Capture The Flag',
  'Low Level Programming',
  'Reverse Engineering',
  'Cryptography',
  'System Design',
  'Binary Exploitation',
  'Competitive Programming',
  'OS Tinkering',
  'Backend Engineering',
  'Reading Research Papers',
  'Anime Movies',
  'Music Discovery',
  'Writing Notes',
  'UI Experiments',
]

const topMovies = [
  {
    title: 'Josee to Tora to Sakana-tachi',
    meta: 'Anime film',
    detail: '2020',
    href: 'https://en.wikipedia.org/wiki/Josee,_the_Tiger_and_the_Fish_(2020_film)',
    image:
      'https://upload.wikimedia.org/wikipedia/en/f/f0/Josee%2C_the_Tiger_and_the_Fish_2020_film_poster.jpg',
  },
  {
    title: 'Chainsaw Man - The Movie: Reze Arc',
    meta: 'Anime film',
    detail: '2025',
    href: 'https://en.wikipedia.org/wiki/Chainsaw_Man_%E2%80%93_The_Movie:_Reze_Arc',
    image: 'https://upload.wikimedia.org/wikipedia/en/9/95/Chainsaw_Man_Reze_Arc_movie_poster.jpg',
  },
  {
    title: 'La La Land',
    meta: 'Musical film',
    detail: '2016',
    href: 'https://en.wikipedia.org/wiki/La_La_Land',
    image: 'https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png',
  },
]

const topBooks = [
  {
    title: 'Dune',
    meta: 'Frank Herbert',
    detail: '1965',
    href: 'https://en.wikipedia.org/wiki/Dune_(novel)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Dune_by_Frank_Herbert_first_edition_cover.jpg',
  },
    {
      title: "Omniscient Reader's Viewpoint",
      meta: 'sing N song',
      detail: '2018',
      href: 'https://en.wikipedia.org/wiki/Omniscient_Reader%27s_Viewpoint',
      image: 'https://images.yenpress.com/imgs/9798400901065.jpg?h=612&s=722d8d575c94d10d23e8dbe9bff4d87e&type=books&w=408',
    },
  {
    title: 'The Lord of the Rings',
    meta: 'J. R. R. Tolkien',
    detail: '1954',
    href: 'https://en.wikipedia.org/wiki/The_Lord_of_the_Rings',
    image: 'https://upload.wikimedia.org/wikipedia/en/e/e9/First_Single_Volume_Edition_of_The_Lord_of_the_Rings.gif',
  },
]

function RevealBlock({ amount = 0.2, children, className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

function StaggerGroup({
  'aria-label': ariaLabel,
  amount = 0.16,
  children,
  className,
  delayChildren = 0,
  stagger = 0.08,
}: StaggerProps) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.div
      aria-label={ariaLabel}
      className={className}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'show'}
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.div
      className={className}
      variants={{
        hidden: shouldReduceMotion ? {} : { opacity: 0, y: 24 },
        show: shouldReduceMotion
          ? {}
          : {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              },
            },
      }}
    >
      {children}
    </motion.div>
  )
}

function getTypingDelay(character: string) {
  if (character === ' ') return 38
  if (character === ',') return 145
  if (character === '.') return 110
  return 72
}

function renderTypedLine(line: TypedLine, visibleChars: number, showCursor: boolean) {
  const prefixChars = Math.min(visibleChars, line.prefix.length)
  const highlightChars = Math.min(
    Math.max(visibleChars - line.prefix.length, 0),
    line.highlight.length
  )
  const suffixChars = Math.max(visibleChars - line.prefix.length - line.highlight.length, 0)

  return (
    <>
      <span>{line.prefix.slice(0, prefixChars)}</span>
      {highlightChars > 0 && (
        <span className="typing-underline">{line.highlight.slice(0, highlightChars)}</span>
      )}
      <span>{line.suffix.slice(0, suffixChars)}</span>
      {showCursor && <span className="typing-cursor" aria-hidden="true"></span>}
    </>
  )
}

function TypedSectionTitle({ className, line }: { className: string; line: TypedLine }) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const fullText = `${line.prefix}${line.highlight}${line.suffix}`
  const [isActive, setIsActive] = useState(shouldReduceMotion)
  const [visibleChars, setVisibleChars] = useState(shouldReduceMotion ? fullText.length : 0)

  useEffect(() => {
    if (shouldReduceMotion) {
      return
    }

    const node = titleRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.55 }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [shouldReduceMotion])

  useEffect(() => {
    if (shouldReduceMotion || !isActive || visibleChars === fullText.length) {
      return
    }

    const nextChar = fullText[visibleChars]
    const timer = window.setTimeout(() => {
      setVisibleChars((current) => current + 1)
    }, getTypingDelay(nextChar))

    return () => window.clearTimeout(timer)
  }, [fullText, isActive, shouldReduceMotion, visibleChars])

  const currentChars = shouldReduceMotion ? fullText.length : visibleChars
  const showCursor = !shouldReduceMotion && isActive

  return (
    <h1 ref={titleRef} className={className} aria-label={fullText}>
      <span className="typing-line">{renderTypedLine(line, currentChars, showCursor)}</span>
    </h1>
  )
}

function MiscellaneousPage({ year }: MiscellaneousPageProps) {
  const [track, setTrack] = useState<RecentlyPlayedTrack | null>(null)
  const [topSongs, setTopSongs] = useState<SpotifyTrackPreview[]>([])
  const [spotifyMessage, setSpotifyMessage] = useState('Connecting to Spotify...')
  const [spotifyState, setSpotifyState] = useState<'loading' | 'ready' | 'unavailable'>('loading')
  const [topSongsMessage, setTopSongsMessage] = useState('Loading selected songs...')
  const latestTrackRef = useRef<RecentlyPlayedTrack | null>(null)

  useEffect(() => {
    latestTrackRef.current = track
  }, [track])

  useEffect(() => {
    const controller = new AbortController()

    const loadTopSongs = async (signal: AbortSignal) => {
      try {
        const payload = await fetchTopSongs(signal)

        if (payload.tracks.length > 0) {
          setTopSongs(payload.tracks)
          setTopSongsMessage('')
          return
        }

        setTopSongs([])
        setTopSongsMessage(payload.message ?? 'No Spotify track details are available right now.')
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return
        }

        setTopSongs([])
        setTopSongsMessage(SPOTIFY_TOP_SONGS_FALLBACK_MESSAGE)
      }
    }

    loadTopSongs(controller.signal)

    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    let intervalId: number | null = null
    let requestController: AbortController | null = null
    let isDisposed = false

    const clearTrackInterval = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId)
        intervalId = null
      }
    }

    const loadTrack = async () => {
      requestController?.abort()
      requestController = new AbortController()

      try {
        const payload = await fetchRecentlyPlayedTrack(requestController.signal)

        if (isDisposed) {
          return
        }

        if (payload.track) {
          latestTrackRef.current = payload.track
          setTrack(payload.track)
          setSpotifyMessage(payload.message ?? '')
          setSpotifyState('ready')
          return
        }

        latestTrackRef.current = null
        setTrack(null)
        setSpotifyMessage(payload.message ?? 'No recently played track is available right now.')
        setSpotifyState('unavailable')
      } catch (error) {
        if ((error as Error).name === 'AbortError' || isDisposed) {
          return
        }

        if (latestTrackRef.current) {
          setSpotifyMessage((error as Error).message ?? SPOTIFY_FALLBACK_MESSAGE)
          setSpotifyState('ready')
          return
        }

        latestTrackRef.current = null
        setTrack(null)
        setSpotifyMessage(SPOTIFY_FALLBACK_MESSAGE)
        setSpotifyState('unavailable')
      }
    }

    const startTrackPolling = () => {
      if (document.visibilityState === 'hidden' || intervalId !== null) {
        return
      }

      intervalId = window.setInterval(() => {
        void loadTrack()
      }, SPOTIFY_REFRESH_INTERVAL_MS)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        requestController?.abort()
        clearTrackInterval()
        return
      }

      void loadTrack()
      startTrackPolling()
    }

    if (document.visibilityState === 'visible') {
      void loadTrack()
      startTrackPolling()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      isDisposed = true
      requestController?.abort()
      clearTrackInterval()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <SiteShell isHomePage={false} mainClassName="miscellaneous-page-main" year={year}>
      <section className="section miscellaneous-page-section">
        <div className="section-divider"></div>

        <div className="blog-breadcrumbs">
          <a href="/">Main</a>
          <span aria-hidden="true">&rsaquo;</span>
          <span>Miscellaneous</span>
        </div>

        <RevealBlock className="miscellaneous-hero" amount={0.35}>
          <div className="miscellaneous-hero-media">
            <TypedSectionTitle
              className="miscellaneous-page-title typing-section-title"
              line={miscellaneousTypingLine}
            />
            <div className="miscellaneous-hero-gif">
              <img
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXFmdHo0MngxbW8xZ2ZkejJlZzJ6cXRtODR2a3g1ZGtvcGlodDFscSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/GSGEyGyJfedNyfenTx/giphy.gif"
                alt="Animated reaction"
                loading="lazy"
              />
            </div>
          </div>

          <div className="miscellaneous-intro">
            <p>
              Most things do not arrive fully formed. They begin as a sentence I do not want to
              lose, a reference worth returning to, a prompt that still feels unfinished, or a
              thread I keep pulling long before it earns a proper place in the archive.
            </p>
            <p>
              This page is where those early signals stay visible. It is looser, closer, and more
              immediate than the main body of work, meant to hold the fragments before they settle
              into something more deliberate.
            </p>
          </div>
        </RevealBlock>

        <StaggerGroup className="miscellaneous-deck" amount={0.16} aria-label="Miscellaneous cards">
          <StaggerItem className="miscellaneous-primary-card-shell">
            <article className="miscellaneous-spotify-card">
              <div className="miscellaneous-card-head">
                <div>
                  <h2>Last played.</h2>
                </div>
                <span className="miscellaneous-spotify-mark" aria-hidden="true">
                  <SiSpotify />
                </span>
              </div>

              {spotifyState === 'ready' && track ? (
                <div className="miscellaneous-spotify-layout">
                  <div className="miscellaneous-spotify-art">
                    {track.image ? (
                      <img src={track.image} alt={`${track.album} cover art`} loading="lazy" />
                    ) : (
                      <span className="miscellaneous-spotify-art-fallback">
                        <SiSpotify aria-hidden="true" />
                      </span>
                    )}
                  </div>

                  <div className="miscellaneous-spotify-copy">
                    <p className="miscellaneous-spotify-status">{formatPlayedAtLabel(track.playedAt)}</p>
                    <a
                      className="miscellaneous-spotify-title"
                      href={track.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {track.title}
                      <FiArrowUpRight aria-hidden="true" />
                    </a>
                    <p className="miscellaneous-spotify-meta">
                      {track.artists.join(' · ')}
                      <span aria-hidden="true"> · </span>
                      <span>{track.album}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="miscellaneous-spotify-empty">
                  <span className="miscellaneous-spotify-empty-mark" aria-hidden="true">
                    <FiClock />
                  </span>
                  <p>{spotifyMessage}</p>
                </div>
              )}
            </article>
          </StaggerItem>

          <StaggerItem>
            <article className="miscellaneous-note-card">
              <div className="miscellaneous-panel-head">
                <FiCompass aria-hidden="true" />
                <h2>Hobbies.</h2>
              </div>
              <div className="miscellaneous-tag-cloud">
                {hobbies.map((item) => (
                  <span className="miscellaneous-tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </article>
          </StaggerItem>
        </StaggerGroup>

        <StaggerGroup className="miscellaneous-grid" amount={0.16} delayChildren={0.06}>
          <StaggerItem>
            <article className="miscellaneous-panel">
              <div className="miscellaneous-panel-head">
                <FiFilm aria-hidden="true" />
                <h2>Top 3 movie.</h2>
              </div>
              <div className="miscellaneous-song-list">
                {topMovies.map((movie, index) => (
                  <a
                    className="miscellaneous-song-item"
                    href={movie.href}
                    key={movie.title}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="miscellaneous-song-rank">0{index + 1}</span>
                    <span className="miscellaneous-song-art">
                      <img src={movie.image} alt={`${movie.title} poster`} loading="lazy" />
                    </span>
                    <span className="miscellaneous-song-copy">
                      <span className="miscellaneous-song-title">{movie.title}</span>
                      <span className="miscellaneous-song-meta">{movie.meta}</span>
                      <span className="miscellaneous-song-album">{movie.detail}</span>
                    </span>
                    <FiArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </div>
            </article>
          </StaggerItem>

          <StaggerItem>
            <article className="miscellaneous-panel">
              <div className="miscellaneous-panel-head">
                <SiSpotify aria-hidden="true" />
                <h2>Top 3 songs.</h2>
              </div>
              {topSongs.length > 0 ? (
                <div className="miscellaneous-song-list">
                  {topSongs.map((song, index) => (
                    <a
                      className="miscellaneous-song-item"
                      href={song.href}
                      key={`${song.href}-${index}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="miscellaneous-song-rank">0{index + 1}</span>
                      <span className="miscellaneous-song-art">
                        {song.image ? (
                          <img src={song.image} alt={`${song.album} cover art`} loading="lazy" />
                        ) : (
                          <span className="miscellaneous-song-art-fallback" aria-hidden="true">
                            <SiSpotify />
                          </span>
                        )}
                      </span>
                      <span className="miscellaneous-song-copy">
                        <span className="miscellaneous-song-title">{song.title}</span>
                        <span className="miscellaneous-song-meta">{song.artists.join(', ')}</span>
                        <span className="miscellaneous-song-album">{song.album}</span>
                      </span>
                      <FiArrowUpRight aria-hidden="true" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="miscellaneous-song-empty">
                  <p>{topSongsMessage}</p>
                </div>
              )}
            </article>
          </StaggerItem>

          <StaggerItem>
            <article className="miscellaneous-panel">
              <div className="miscellaneous-panel-head">
                <FiBookOpen aria-hidden="true" />
                <h2>Top 3 books/novels.</h2>
              </div>
              <div className="miscellaneous-song-list">
                {topBooks.map((book, index) => (
                  <a
                    className="miscellaneous-song-item"
                    href={book.href}
                    key={book.title}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="miscellaneous-song-rank">0{index + 1}</span>
                    <span className="miscellaneous-song-art">
                      <img src={book.image} alt={`${book.title} cover`} loading="lazy" />
                    </span>
                    <span className="miscellaneous-song-copy">
                      <span className="miscellaneous-song-title">{book.title}</span>
                      <span className="miscellaneous-song-meta">{book.meta}</span>
                      <span className="miscellaneous-song-album">{book.detail}</span>
                    </span>
                    <FiArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </div>
            </article>
          </StaggerItem>
        </StaggerGroup>

        <RevealBlock className="page-back-home" amount={0.6} delay={0.1}>
          <a href="/">Back to home</a>
        </RevealBlock>
      </section>
    </SiteShell>
  )
}

export default MiscellaneousPage


