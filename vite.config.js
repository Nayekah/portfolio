/* global process */

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function spotifyApiDevPlugin(mode) {
  async function handleSpotifyRequest(server, request, response, endpointFile) {
    const env = loadEnv(mode, server.config.root, '')

    for (const key of ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'SPOTIFY_REFRESH_TOKEN']) {
      if (!process.env[key] && env[key]) {
        process.env[key] = env[key]
      }
    }

    const moduleUrl = `/${endpointFile}?t=${Date.now()}`
    const { default: handler } = await server.ssrLoadModule(moduleUrl)

    const apiResponse = {
      status(code) {
        response.statusCode = code
        return this
      },
      json(payload) {
        if (!response.getHeader('Content-Type')) {
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
        }
        response.end(JSON.stringify(payload))
        return payload
      },
      setHeader(name, value) {
        response.setHeader(name, value)
      },
    }

    await handler(request, apiResponse)
  }

  return {
    name: 'spotify-api-dev',
    configureServer(server) {
      const routes = [
        {
          path: '/api/spotify/recently-played',
          endpointFile: 'api/spotify/recently-played.ts',
          fallback: {
            message: 'Spotify dev middleware failed while handling the request.',
            track: null,
          },
        },
        {
          path: '/api/spotify/top-songs',
          endpointFile: 'api/spotify/top-songs.ts',
          fallback: {
            message: 'Spotify dev middleware failed while handling the request.',
            tracks: [],
          },
        },
      ]

      for (const route of routes) {
        server.middlewares.use(route.path, async (request, response, next) => {
          if (request.method !== 'GET') {
            next()
            return
          }

          try {
            await handleSpotifyRequest(server, request, response, route.endpointFile)
          } catch (error) {
            response.statusCode = 500
            response.setHeader('Content-Type', 'application/json; charset=utf-8')
            response.end(
              JSON.stringify({
                ...route.fallback,
                message: error instanceof Error ? error.message : route.fallback.message,
              })
            )
          }
        })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), spotifyApiDevPlugin(mode)],
}))
