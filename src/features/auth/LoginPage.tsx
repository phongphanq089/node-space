import { Link, useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/core/button'
import { Input } from '@/components/ui/core/input'

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
            className="text-ns-primary-lt hover:text-ns-primary font-semibold no-underline transition-colors"
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
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.62rem] font-bold tracking-wider text-ns-muted uppercase">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        {/* Password — has an extra "Forgot password" link next to label */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[0.62rem] font-bold tracking-wider text-ns-muted uppercase">
              Password
            </label>
            <span className="text-[0.58rem] font-medium text-ns-faint">
              At least 8 characters
            </span>
          </div>
          <Input type="password" placeholder="••••••••" required />
        </div>

        <Button
          onClick={() => navigate({ to: '/dashboard' })}
          size="lg"
          className="mt-2 w-full cursor-pointer"
        >
          <span>Log in</span>
          <span className="ml-1 transition-transform group-hover/button:translate-x-1">
            →
          </span>
        </Button>
      </form>
    </AuthCard>
  )
}
