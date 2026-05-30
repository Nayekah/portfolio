/* global process */

import { getUserAccessToken, mapSpotifyTrack, REQUIRED_ENV_VARS } from './shared.js'

const SPOTIFY_EMPTY_MESSAGE = 'No recently played track is available right now.'
const SPOTIFY_UNAVAILABLE_MESSAGE = 'Spotify listening data is temporarily unavailable.'

export default async function handler(_request, response) {
  response.setHeader('Cache-Control', 'no-store')

  if (REQUIRED_ENV_VARS.some((key) => !process.env[key])) {
    return response.status(503).json({
      message: SPOTIFY_UNAVAILABLE_MESSAGE,
      track: null,
    })
  }

  try {
    const accessToken = await getUserAccessToken()
    const spotifyResponse = await fetch(
      'https://api.spotify.com/v1/me/player/recently-played?limit=1',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!spotifyResponse.ok) {
      throw new Error(`Spotify recently played request failed with status ${spotifyResponse.status}`)
    }

    const payload = await spotifyResponse.json()
    const item = payload.items?.[0]
    const track = item?.track

    if (!track) {
      return response.status(200).json({
        message: SPOTIFY_EMPTY_MESSAGE,
        track: null,
      })
    }

    return response.status(200).json({
      track: {
        ...mapSpotifyTrack(track),
        playedAt: item.played_at,
      },
    })
  } catch (error) {
    console.error('[spotify/recently-played]', error)

    return response.status(500).json({
      message: SPOTIFY_UNAVAILABLE_MESSAGE,
      track: null,
    })
  }
}
