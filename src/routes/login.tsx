import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSessionFn } from '@/features/auth/auth.fns'
import { LoginPage } from '@/features/auth/components/LoginPage'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Sign In | Node Space' },
      {
        name: 'description',
        content:
          'Sign in to Node Space and access your personal workspace, notebooks, and notes.',
      },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (session) throw redirect({ to: '/workspace' })
  },
  component: LoginPage,
})
