import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/core/button'
import { Input } from '@/components/ui/core/input'

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
            className="text-ns-primary-lt hover:text-ns-primary font-semibold no-underline transition-colors"
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
          <div key={f.id} className="flex flex-col gap-1.5">
            <label
              htmlFor={f.id}
              className="text-[0.62rem] font-bold tracking-wider text-ns-muted uppercase"
            >
              {f.label}
            </label>
            <Input
              id={f.id}
              type={f.type}
              placeholder={f.placeholder}
              autoComplete={f.autoComplete}
              required
            />
          </div>
        ))}

        <Button size="lg" className="mt-2 w-full cursor-pointer">
          <span>Create account</span>
          <span className="ml-1 transition-transform group-hover/button:translate-x-1">
            →
          </span>
        </Button>
      </form>
    </AuthCard>
  )
}
