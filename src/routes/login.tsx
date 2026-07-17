import { Button } from '@/components/ui/core/button'
import { DotmCircular } from '@/components/ui/core/dotm-circular'
import { Input } from '@/components/ui/core/input'
import { loginSchema } from '@/features/auth/auth.validate'
import type { LoginSchemaValues } from '@/features/auth/auth.validate'
import AuthCard from '@/features/auth/components/AuthCard'
import {
  createFileRoute,
  Link,
  useNavigate,
  redirect,
} from '@tanstack/react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { signIn } from '@/lib/auth-client'
import { getSessionFn } from '@/features/auth/auth.fns'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/core/field'
import PasswordStrengthIndicator from '@/features/auth/components/PasswordStrengthIndicator'
import { toast } from 'sonner'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (session) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema as any),
    criteriaMode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const passwordValue = form.watch('password') || ''

  const onSubmit = async (data: LoginSchemaValues) => {
    setLoading(true)

    try {
      await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: '/dashboard',
        fetchOptions: {
          onError: (ctx) => {
            toast.error('failed', {
              position: 'top-center',
              description: ctx.error.message,
            })
            setLoading(false)
          },
          onSuccess: () => {
            navigate({ to: '/dashboard' })
            toast.success('Login success !', {
              position: 'top-center',
            })
          },
        },
      })
    } catch (err) {
      toast.error('failed', {
        position: 'top-center',
        description: 'An unexpected error occurred',
      })

      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to continue with NodeSpace"
      footer={
        <>
          Don't have an account?{' '}
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
                <FieldLabel htmlFor="reg-email">Email</FieldLabel>
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
                    placeholder="••••••••"
                    showPasswordToggle
                  />
                  <PasswordStrengthIndicator passwordValue={passwordValue} />
                </Field>
              )
            }}
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

Input.displayName = 'Input'
