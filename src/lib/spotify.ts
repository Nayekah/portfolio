export type RecentlyPlayedTrack = {
  album: string
  artists: string[]
  href: string
  image: string | null
  playedAt: string
  title: string
}

export type SpotifyTrackPreview = {
  album: string
  artists: string[]
  href: string
  image: string | null
  title: string
}

export type RecentlyPlayedResponse = {
  cached?: boolean
  message?: string
  stale?: boolean
  track: RecentlyPlayedTrack | null
}

export type TopSongsResponse = {
  message?: string
  tracks: SpotifyTrackPreview[]
}

const SPOTIFY_RECENTLY_PLAYED_ERROR_MESSAGE = 'Spotify listening data is temporarily unavailable.'
const SPOTIFY_TOP_SONGS_ERROR_MESSAGE = 'Spotify song details are temporarily unavailable.'

export async function fetchRecentlyPlayedTrack(signal?: AbortSignal) {
  let response: Response

  try {
    response = await fetch('/api/spotify/recently-played', {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
      signal,
    })
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw error
    }

    throw new Error(SPOTIFY_RECENTLY_PLAYED_ERROR_MESSAGE)
  }

  let payload: RecentlyPlayedResponse | null = null

  try {
    payload = (await response.json()) as RecentlyPlayedResponse
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(payload?.message ?? SPOTIFY_RECENTLY_PLAYED_ERROR_MESSAGE)
  }

  return payload
}

export async function fetchTopSongs(signal?: AbortSignal) {
  let response: Response

  try {
    response = await fetch('/api/spotify/top-songs', {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
      signal,
    })
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw error
    }

    throw new Error(SPOTIFY_TOP_SONGS_ERROR_MESSAGE)
  }

  let payload: TopSongsResponse | null = null

  try {
    payload = (await response.json()) as TopSongsResponse
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(payload?.message ?? SPOTIFY_TOP_SONGS_ERROR_MESSAGE)
  }

  return payload
}

export function formatPlayedAtLabel(playedAt: string) {
  const playedDate = new Date(playedAt)
  const diffMs = playedDate.getTime() - Date.now()
  const diffMinutes = Math.round(diffMs / (1000 * 60))
  const absoluteMinutes = Math.abs(diffMinutes)
  const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (absoluteMinutes < 1) {
    return 'Played just now'
  }

  if (absoluteMinutes < 60) {
    return `Played ${relativeTime.format(diffMinutes, 'minute')}`
  }

  const diffHours = Math.round(diffMinutes / 60)

  if (Math.abs(diffHours) < 24) {
    return `Played ${relativeTime.format(diffHours, 'hour')}`
  }

  const diffDays = Math.round(diffHours / 24)
  return `Played ${relativeTime.format(diffDays, 'day')}`
}
