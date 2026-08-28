import { createFileRoute } from '@tanstack/react-router'
import { ForgotPasswordPage } from '@/features/auth/components/ForgotPasswordPage'

export const Route = createFileRoute('/forgot-password')({
  head: () => ({
    meta: [
      { title: 'Reset Password | Note Flow' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: ForgotPasswordPage,
})
