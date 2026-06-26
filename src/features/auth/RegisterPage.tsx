import { Link } from '@tanstack/react-router'

import CornerCutButton from '@/components/ui/core/neon-button'
import NeonInput from '@/components/ui/core/neon-input'

import AuthCard from './components/AuthCard'

const FIELDS = [
  {
    id: 'input-name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'John Doe',
    autoComplete: 'name',
  },
  {
    id: 'input-email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    autoComplete: 'email',
  },
  {
    id: 'input-password',
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    autoComplete: 'new-password',
  },
  {
    id: 'input-confirm',
    label: 'Confirm Password',
    type: 'password',
    placeholder: '••••••••',
    autoComplete: 'new-password',
  },
] as const

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create Account"
      subtitle="Start your journey of connecting ideas"
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-ns-accent-lt no-underline transition-colors hover:text-ns-accent"
          >
            Log in
          </Link>
        </>
      }
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-4"
      >
        {FIELDS.map((f) => (
          <NeonInput key={f.id} {...f} color="purple" />
        ))}

        <CornerCutButton
          color="pink"
          showArrow
          hoverEffect="glow"
          className="text-center"
        >
          Create account
        </CornerCutButton>
      </form>
    </AuthCard>
  )
}
