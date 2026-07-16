import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '@/components/ui/core/button'
import { Input } from '@/components/ui/core/input'

import AuthCard from './components/AuthCard'
import { signUp } from '@/lib/auth-client'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không khớp!')
      return
    }

    setLoading(true)
    try {
      await signUp.email(
        {
          email,
          password,
          name,
          callbackURL: '/dashboard',
        },
        {
          onRequest: () => {
            setLoading(true)
          },
          onError: (ctx) => {
            setErrorMsg(ctx.error.message || 'Đăng ký thất bại!')
            setLoading(false)
          },
          onSuccess: () => {
            setLoading(false)
            navigate({ to: '/dashboard' })
          },
        }
      )
    } catch (err: any) {
      setErrorMsg(err.message || 'Đã xảy ra lỗi không xác định!')
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Create Account"
      subtitle="Start your journey of connecting ideas"
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-ns-primary-lt no-underline transition-colors hover:text-ns-primary"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMsg && (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-500">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="input-name"
            className="text-[0.62rem] font-bold tracking-wider text-ns-muted uppercase"
          >
            Full Name
          </label>
          <Input
            id="input-name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="input-email"
            className="text-[0.62rem] font-bold tracking-wider text-ns-muted uppercase"
          >
            Email
          </label>
          <Input
            id="input-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="input-password"
            className="text-[0.62rem] font-bold tracking-wider text-ns-muted uppercase"
          >
            Password
          </label>
          <Input
            id="input-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="input-confirm"
            className="text-[0.62rem] font-bold tracking-wider text-ns-muted uppercase"
          >
            Confirm Password
          </label>
          <Input
            id="input-confirm"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button
          size="lg"
          className="mt-2 w-full cursor-pointer"
          disabled={loading}
        >
          <span>{loading ? 'Creating...' : 'Create account'}</span>
          {!loading && (
            <span className="ml-1 transition-transform group-hover/button:translate-x-1">
              →
            </span>
          )}
        </Button>
      </form>
    </AuthCard>
  )
}
