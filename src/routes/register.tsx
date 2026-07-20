import { Button } from '@/components/ui/core/button'
import { DotmCircular } from '@/components/ui/core/dotm-circular'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/core/field'
import { Input } from '@/components/ui/core/input'
import { registerSchema } from '@/features/auth/auth.validate'
import type { RegisterSchemaValues } from '@/features/auth/auth.validate'
import AuthCard from '@/features/auth/components/AuthCard'
import PasswordStrengthIndicator from '@/features/auth/components/PasswordStrengthIndicator'
import { signUp } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createFileRoute,
  useNavigate,
  Link,
  redirect,
} from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import { getSessionFn } from '@/features/auth/auth.fns'

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (session) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const form = useForm<RegisterSchemaValues>({
    resolver: zodResolver(registerSchema as any),
    criteriaMode: 'all',
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      confirmPassword: '',
    },
  })

  const passwordValue = form.watch('password') || ''

  const onSubmit = async (data: RegisterSchemaValues) => {
    setLoading(true)
    setErrorMsg('')
    try {
      await signUp.email({
        email: data.email,
        password: data.password,
        name: data.fullName,
        callbackURL: '/dashboard',
        fetchOptions: {
          onError: (ctx) => {
            setErrorMsg(ctx.error.message || 'Registration failed')
            setLoading(false)
          },
          onSuccess: () => {
            form.reset()
            navigate({ to: '/dashboard' })
          },
        },
      })
    } catch (err) {
      setErrorMsg('An unexpected error occurred')
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
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reg-fullname">Full Name</FieldLabel>
                <Input
                  {...field}
                  type="text"
                  placeholder="John Doe"
                  aria-invalid={fieldState.invalid}
                  autoComplete="name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reg-mail">Email</FieldLabel>
                <Input
                  {...field}
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
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reg-password">Password</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    showPasswordToggle
                    placeholder="••••••••"
                  />
                  <PasswordStrengthIndicator passwordValue={passwordValue} />
                </Field>
              )
            }}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reg-confirm">Confirm Password</FieldLabel>
                <Input
                  {...field}
                  type="password"
                  showPasswordToggle
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        {errorMsg && (
          <p className="mt-1 text-center text-xs font-semibold text-destructive">
            {errorMsg}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="relative mt-2 w-full cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span>{loading ? 'Creating account...' : 'Create account'}</span>
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
      </form>
    </AuthCard>
  )
}
