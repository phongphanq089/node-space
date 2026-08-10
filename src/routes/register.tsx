import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSessionFn } from '@/features/auth/auth.fns'
import { RegisterPage } from '@/features/auth/components/RegisterPage'

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (session) throw redirect({ to: '/workspace' })
  },
  component: RegisterPage,
})
