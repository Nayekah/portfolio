/* global Buffer, process */

export const REQUIRED_ENV_VARS = [
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET',
  'SPOTIFY_REFRESH_TOKEN',
]

export const SPOTIFY_TOP_TRACK_IDS = [
  '4wUQvovMEkByMvZNCecZ9v',
  '0DYvTdqBqW6erA1a7pFzVo',
  '5HhYHpxwdGTCO5YK7dycoT',
]

export async function getUserAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

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

  const payload = await response.json()
  return payload.access_token
}

export function mapSpotifyTrack(track) {
  return {
    album: track.album?.name ?? 'Unknown album',
    artists: Array.isArray(track.artists) ? track.artists.map((artist) => artist.name) : [],
    href: track.external_urls?.spotify ?? track.href ?? 'https://open.spotify.com/',
    image: track.album?.images?.[0]?.url ?? null,
    title: track.name ?? 'Unknown track',
  }
}
