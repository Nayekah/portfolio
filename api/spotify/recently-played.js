/* global process */

import { getUserAccessToken, mapSpotifyTrack, REQUIRED_ENV_VARS } from './shared.js'

const SPOTIFY_CACHE_KEY = '__nayak4SpotifyRecentlyPlayedCache'
const SPOTIFY_CACHE_TTL_MS = 120_000
const SPOTIFY_MIN_RETRY_AFTER_MS = 30_000
const SPOTIFY_EMPTY_MESSAGE = 'No recently played track is available right now.'
const SPOTIFY_STALE_MESSAGE = 'Showing the last available track while Spotify is temporarily rate limited.'
const SPOTIFY_STALE_UNAVAILABLE_MESSAGE =
  'Showing the last available track while Spotify is temporarily unavailable.'
const SPOTIFY_UNAVAILABLE_MESSAGE = 'Spotify listening data is temporarily unavailable.'

function getRecentlyPlayedCache() {
  if (!globalThis[SPOTIFY_CACHE_KEY]) {
    globalThis[SPOTIFY_CACHE_KEY] = {
      fetchedAt: 0,
      hasSnapshot: false,
      nextAllowedFetchAt: 0,
      track: null,
    }
  }

  return globalThis[SPOTIFY_CACHE_KEY]
}

function toRecentlyPlayedTrackPayload(track, playedAt) {
  return {
    ...mapSpotifyTrack(track),
    playedAt,
  }
}

function respondWithCachedSnapshot(response, cache, message, stale = false) {
  return response.status(200).json({
    cached: true,
    message,
    stale,
    track: cache.track,
  })
}

export default async function handler(_request, response) {
  response.setHeader('Cache-Control', 'no-store')
  const cache = getRecentlyPlayedCache()
  const now = Date.now()

  if (REQUIRED_ENV_VARS.some((key) => !process.env[key])) {
    if (cache.track) {
      return respondWithCachedSnapshot(response, cache, SPOTIFY_STALE_UNAVAILABLE_MESSAGE, true)
    }

    return response.status(503).json({
      message: SPOTIFY_UNAVAILABLE_MESSAGE,
      track: null,
    })
  }

  if (cache.hasSnapshot && now - cache.fetchedAt < SPOTIFY_CACHE_TTL_MS) {
    return respondWithCachedSnapshot(response, cache, cache.track ? undefined : SPOTIFY_EMPTY_MESSAGE)
  }

  if (cache.track && now < cache.nextAllowedFetchAt) {
    return respondWithCachedSnapshot(response, cache, SPOTIFY_STALE_MESSAGE, true)
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
      if (spotifyResponse.status === 429) {
        const retryAfterSeconds = Number.parseInt(
          spotifyResponse.headers.get('Retry-After') ?? '',
          10
        )
        const retryAfterMs = Number.isFinite(retryAfterSeconds)
          ? Math.max(retryAfterSeconds * 1000, SPOTIFY_MIN_RETRY_AFTER_MS)
          : SPOTIFY_MIN_RETRY_AFTER_MS

        cache.nextAllowedFetchAt = now + retryAfterMs

        if (cache.track) {
          return respondWithCachedSnapshot(response, cache, SPOTIFY_STALE_MESSAGE, true)
        }
      }

      throw new Error(`Spotify recently played request failed with status ${spotifyResponse.status}`)
    }

    const payload = await spotifyResponse.json()
    const item = payload.items?.[0]
    const track = item?.track

    cache.fetchedAt = Date.now()
    cache.hasSnapshot = true
    cache.nextAllowedFetchAt = 0

    if (!track) {
      cache.track = null

      return response.status(200).json({
        message: SPOTIFY_EMPTY_MESSAGE,
        track: null,
      })
    }

    cache.track = toRecentlyPlayedTrackPayload(track, item.played_at)

    return response.status(200).json({
      track: cache.track,
    })
  } catch (error) {
    console.error('[spotify/recently-played]', error)

    if (cache.track) {
      return respondWithCachedSnapshot(response, cache, SPOTIFY_STALE_UNAVAILABLE_MESSAGE, true)
    }

    return response.status(500).json({
      message: SPOTIFY_UNAVAILABLE_MESSAGE,
      track: null,
    })
  }
}
