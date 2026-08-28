import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSessionFn } from '@/features/auth/auth.fns'
import { VerifyEmailPage } from '@/features/auth/components/VerifyEmailPage'

export const Route = createFileRoute('/verify-email')({
  head: () => ({
    meta: [
      { title: 'Verify Your Email | Note Flow' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const session = await getSessionFn()
    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    if (session.user.emailVerified) {
      throw redirect({ to: '/' })
    }
    return {
      session,
    }
  },
  component: VerifyEmailPage,
})
