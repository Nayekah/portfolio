import type { ApiJsonResponse, SpotifyTrackPreview } from './shared.js'

const SPOTIFY_TOP_TRACK_URLS = [
  'https://open.spotify.com/track/4wUQvovMEkByMvZNCecZ9v',
  'https://open.spotify.com/track/4twllsTUoTAFxiVeq3bNjq?si=a6011b2d911241e0',
  'https://open.spotify.com/track/5HhYHpxwdGTCO5YK7dycoT',
] as const

const SPOTIFY_TOP_SONGS_UNAVAILABLE_MESSAGE = 'Spotify song details are temporarily unavailable.'

interface TopSongsResponseBody {
  message?: string
  tracks: SpotifyTrackPreview[]
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_match, decimal: string) =>
      String.fromCodePoint(Number.parseInt(decimal, 10))
    )
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function parseTrackSummaryFromPage(html: string, href: string): SpotifyTrackPreview {
  const rawTitle = html.match(/<meta property="og:title" content="([^"]+)"/i)?.[1] ?? 'Unknown track'
  const image =
    html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1] ?? null
  const rawDescription =
    html.match(/<meta property="og:description" content="([^"]+)"/i)?.[1] ??
    html.match(/<meta name="twitter:description" content="([^"]+)"/i)?.[1] ??
    ''

  const title = decodeHtmlEntities(rawTitle)
  const description = decodeHtmlEntities(rawDescription)
  const artistFromSongPattern = description.match(/Song\s+[Â·-]\s+(.+?)\s+[Â·-]\s+\d{4}$/i)?.[1]
  const artistFromOgPattern = description.split(' Â· ')[0]?.trim()
  const year = description.match(/(\d{4})$/)?.[1] ?? 'Spotify track'

  return {
    album: year,
    artists: artistFromSongPattern
      ? [artistFromSongPattern]
      : artistFromOgPattern
        ? [artistFromOgPattern]
        : [],
    href,
    image,
    title,
  }
}

async function fetchTrackSummary(href: string): Promise<SpotifyTrackPreview> {
  const response = await fetch(href, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  })

  if (!response.ok) {
    throw new Error(`Spotify top songs page request failed with status ${response.status}`)
  }

  const html = await response.text()
  return parseTrackSummaryFromPage(html, href)
}

export default async function handler(
  _request: unknown,
  response: ApiJsonResponse<TopSongsResponseBody>
) {
  response.setHeader('Cache-Control', 'no-store')

  try {
    const tracks = await Promise.all(SPOTIFY_TOP_TRACK_URLS.map(fetchTrackSummary))
    return response.status(200).json({ tracks })
  } catch (error) {
    console.error('[spotify/top-songs]', error)

    return response.status(500).json({
      message: SPOTIFY_TOP_SONGS_UNAVAILABLE_MESSAGE,
      tracks: [],
    })
  }
}
