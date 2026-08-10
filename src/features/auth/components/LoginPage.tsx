import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { signIn } from '@/shared/lib/auth-client'
import { loginSchema } from '@/features/auth/auth.validate'
import type { LoginSchemaValues } from '@/features/auth/auth.validate'

import {
  Button,
  DotmCircular,
  Input,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/ui'

import { AuthCard } from './AuthCard'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'

export function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema as any),
    criteriaMode: 'all',
    defaultValues: { email: '', password: '' },
  })

  const passwordValue = form.watch('password') || ''

  const onSubmit = async (data: LoginSchemaValues) => {
    setLoading(true)
    try {
      await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: '/workspace',
        fetchOptions: {
          onError: (ctx: { error: { message?: string } }) => {
            toast.error('Login failed', {
              position: 'top-center',
              description: ctx.error.message,
            })
            setLoading(false)
          },
          onSuccess: () => {
            toast.success('Login success!', { position: 'top-center' })
            form.reset()
            navigate({ to: '/workspace' })
          },
        },
      })
    } catch {
      toast.error('An unexpected error occurred', { position: 'top-center' })
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to continue with NodeSpace"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-ns-primary-lt no-underline transition-colors hover:text-ns-primary"
          >
            Sign up for free
          </Link>
        </>
      }
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-ns-primary-lt no-underline hover:text-ns-primary"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  {...field}
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  showPasswordToggle
                />
                <PasswordStrengthIndicator passwordValue={passwordValue} />
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="relative mt-2 w-full cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span>{loading ? 'Logging in...' : 'Log in'}</span>
              {!loading && (
                <span className="ml-1 transition-transform group-hover/button:translate-x-1">
                  →
                </span>
              )}
            </div>
            {loading && (
              <div className="absolute top-1/2 right-2 -translate-y-1/2">
                <DotmCircular size={26} dotSize={4} speed={1.2} bloom />
              </div>
            )}
          </Button>
        </FieldGroup>
      </form>
    </AuthCard>
  )
}
