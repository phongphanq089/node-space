import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSessionFn } from '@/features/auth/auth.fns'
import { RegisterPage } from '@/features/auth/components/RegisterPage'

export const Route = createFileRoute('/register')({
  head: () => ({
    meta: [
      { title: 'Create Account | Node Space' },
      {
        name: 'description',
        content:
          'Create your free Node Space account. Start organizing your notes, ideas, and notebooks in your personal workspace.',
      },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (session) throw redirect({ to: '/workspace' })
  },
  component: RegisterPage,
})
