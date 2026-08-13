import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSessionFn } from '@/features/auth/auth.fns'
import { LoginPage } from '@/features/auth/components/LoginPage'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (session) throw redirect({ to: '/workspace' })
  },
  component: LoginPage,
})
