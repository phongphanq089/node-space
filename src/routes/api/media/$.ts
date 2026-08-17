import { createFileRoute } from '@tanstack/react-router'
import { env as cfEnv } from 'cloudflare:workers'

export const Route = createFileRoute('/api/media/$')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const key = params._splat
        if (!key) {
          return new Response('File key is required', { status: 400 })
        }

        const bucket = (cfEnv as any)?.MEDIA_BUCKET
        if (!bucket) {
          return new Response('R2 MEDIA_BUCKET binding not found', {
            status: 500,
          })
        }

        const object = await bucket.get(key)
        if (!object) {
          return new Response('Object not found', { status: 404 })
        }

        const headers = new Headers()
        object.writeHttpMetadata(headers)
        headers.set('etag', object.httpEtag)
        headers.set(
          'Cache-Control',
          object.httpMetadata?.cacheControl ||
            'public, max-age=31536000, immutable'
        )

        return new Response(object.body, {
          headers,
        })
      },
    },
  },
})
