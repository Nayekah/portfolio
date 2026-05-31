export const REQUIRED_ENV_VARS = [
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET',
  'SPOTIFY_REFRESH_TOKEN',
] as const

export const SPOTIFY_TOP_TRACK_IDS = [
  '4wUQvovMEkByMvZNCecZ9v',
  '0DYvTdqBqW6erA1a7pFzVo',
  '5HhYHpxwdGTCO5YK7dycoT',
] as const

export type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number]

export interface SpotifyTrackPreview {
  album: string
  artists: string[]
  href: string
  image: string | null
  title: string
}

export interface SpotifyTrack {
  album?: {
    images?: Array<{ url?: string | null }> | null
    name?: string | null
  } | null
  artists?: Array<{ name?: string | null }> | null
  external_urls?: {
    spotify?: string | null
  } | null
  href?: string | null
  name?: string | null
}

export interface ApiJsonResponse<T> {
  json(payload: T): T
  setHeader(name: string, value: string): void
  status(code: number): ApiJsonResponse<T>
}

interface SpotifyAccessTokenResponse {
  access_token?: string
}

export async function getUserAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Spotify environment variables are missing.')
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Spotify token refresh failed: ${errorText}`)
  }

  const payload = (await response.json()) as SpotifyAccessTokenResponse

  if (!payload.access_token) {
    throw new Error('Spotify token refresh succeeded without an access token.')
  }

  return payload.access_token
}

export function mapSpotifyTrack(track: SpotifyTrack): SpotifyTrackPreview {
  return {
    album: track.album?.name ?? 'Unknown album',
    artists: Array.isArray(track.artists)
      ? track.artists
          .map((artist) => artist.name)
          .filter((artist): artist is string => Boolean(artist))
      : [],
    href: track.external_urls?.spotify ?? track.href ?? 'https://open.spotify.com/',
    image: track.album?.images?.[0]?.url ?? null,
    title: track.name ?? 'Unknown track',
  }
}
