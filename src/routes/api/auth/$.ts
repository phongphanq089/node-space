import { getAuth } from '@/shared/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = getAuth()
        return await auth.handler(request)
      },
      POST: async ({ request }) => {
        const auth = getAuth()
        return await auth.handler(request)
      },
    },
  },
})
