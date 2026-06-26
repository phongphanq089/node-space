import { Link, useNavigate } from '@tanstack/react-router'

import CornerCutButton from '@/components/ui/core/neon-button'
import NeonInput from '@/components/ui/core/neon-input'

import AuthCard from './components/AuthCard'

export default function LoginPage() {
  const navigate = useNavigate()
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to continue with NodeSpace"
      footer={
        <>
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-ns-accent-lt no-underline transition-colors hover:text-ns-accent"
          >
            Sign up for free
          </Link>
        </>
      }
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-4"
      >
        <NeonInput
          type="email"
          label="Password"
          placeholder="you@example.com"
          color="purple"
          autoComplete="email"
        />

        {/* Password — has an extra "Forgot password" link next to label */}
        <div className="flex flex-col gap-1.5">
          <NeonInput
            type="password"
            label="Password"
            placeholder="••••••••"
            color="purple"
            hint="At least 8 characters"
          />
        </div>

        <CornerCutButton
          onClick={() => navigate({ to: '/dashboard' })}
          color="pink"
          showArrow
          hoverEffect="glow"
          className="text-center"
        >
          Log in
        </CornerCutButton>
      </form>
    </AuthCard>
  )
}
