/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { createServerFn } from '@tanstack/react-start'

export const getSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getAuth } = await import('@/lib/auth')
    const { getRequest } = await import('@tanstack/react-start/server')
    const request = getRequest()
    if (!request) return null

    try {
      const auth = getAuth()
      const session = await auth.api.getSession({
        headers: request.headers,
      })
      return session
    } catch (error) {
      console.error('❌ Error getting session:', error)
      return null
    }
  }
)
