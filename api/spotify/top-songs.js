const SPOTIFY_TOP_TRACK_URLS = [
  'https://open.spotify.com/track/4wUQvovMEkByMvZNCecZ9v',
  'https://open.spotify.com/track/0DYvTdqBqW6erA1a7pFzVo',
  'https://open.spotify.com/track/5HhYHpxwdGTCO5YK7dycoT',
]

const SPOTIFY_TOP_SONGS_UNAVAILABLE_MESSAGE = 'Spotify song details are temporarily unavailable.'

function parseTrackSummaryFromPage(html, href) {
  const title = html.match(/<meta property="og:title" content="([^"]+)"/i)?.[1] ?? 'Unknown track'
  const image =
    html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1] ?? null
  const description =
    html.match(/<meta property="og:description" content="([^"]+)"/i)?.[1] ??
    html.match(/<meta name="twitter:description" content="([^"]+)"/i)?.[1] ??
    ''

  const artistFromSongPattern = description.match(/Song\s+[·-]\s+(.+?)\s+[·-]\s+\d{4}$/i)?.[1]
  const artistFromOgPattern = description.split(' · ')[0]?.trim()
  const year = description.match(/(\d{4})$/)?.[1] ?? 'Spotify track'

  return {
    album: year,
    artists: artistFromSongPattern ? [artistFromSongPattern] : artistFromOgPattern ? [artistFromOgPattern] : [],
    href,
    image,
    title,
  }
}

async function fetchTrackSummary(href) {
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

export default async function handler(_request, response) {
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
