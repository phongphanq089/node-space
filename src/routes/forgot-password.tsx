import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import AuthCard from '@/features/auth/components/AuthCard'
import { Button } from '@/shared/ui/core/button'
import { DotmCircular } from '@/shared/ui/core/dotm-circular'
import { Input } from '@/shared/ui/core/input'
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/core/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/shared/ui/core/input-otp'
import PasswordStrengthIndicator from '@/features/auth/components/PasswordStrengthIndicator'
import { authClient } from '@/shared/lib/auth-client'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'request' | 'reset'>('request')
  const [loading, setLoading] = useState(false)

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      await authClient.emailOtp.sendVerificationOtp(
        {
          email,
          type: 'forget-password',
        },
        {
          onSuccess: () => {
            toast.success('Reset code sent!', {
              description: 'Please check your email inbox.',
            })
            setStep('reset')
          },
          onError: (ctx: { error: { message?: string } }) => {
            toast.error('Failed to send code', {
              description:
                ctx.error.message || 'Make sure the email is registered.',
            })
          },
        }
      )
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit verification code')
      return
    }
    if (!password) {
      toast.error('Please enter your new password')
      return
    }

    setLoading(true)
    try {
      await authClient.emailOtp.resetPassword(
        {
          email,
          otp,
          password,
        },
        {
          onSuccess: () => {
            toast.success('Password reset successfully!', {
              description: 'You can now log in with your new password.',
            })
            // Reset states
            setEmail('')
            setOtp('')
            setPassword('')
            navigate({ to: '/login' })
          },
          onError: (ctx: { error: { message?: string } }) => {
            toast.error('Reset failed', {
              description:
                ctx.error.message ||
                'Verification code might be invalid or expired.',
            })
          },
        }
      )
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Reset Password"
      subtitle={
        step === 'request'
          ? 'Enter your email address to receive a verification code.'
          : `Enter the code sent to ${email} and your new password.`
      }
      footer={
        <Link
          to="/login"
          className="font-semibold text-ns-primary-lt no-underline transition-colors hover:text-ns-primary"
        >
          Back to Log In
        </Link>
      }
    >
      {step === 'request' ? (
        <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
              <Input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </Field>

            <Button
              type="submit"
              disabled={loading}
              className="relative mt-2 w-full cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span>
                  {loading ? 'Sending Code...' : 'Send Verification Code'}
                </span>
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
      ) : (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel className="mb-2 block text-center">
                Verification Code
              </FieldLabel>
              <div className="mb-2 flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(val: string) => setOtp(val.replace(/\D/g, ''))}
                  disabled={loading}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot
                      index={0}
                      className="h-10 w-10 rounded-lg border border-ns-border bg-ns-surface text-lg font-bold text-ns-text"
                    />
                    <InputOTPSlot
                      index={1}
                      className="h-10 w-10 rounded-lg border border-ns-border bg-ns-surface text-lg font-bold text-ns-text"
                    />
                    <InputOTPSlot
                      index={2}
                      className="h-10 w-10 rounded-lg border border-ns-border bg-ns-surface text-lg font-bold text-ns-text"
                    />
                    <InputOTPSlot
                      index={3}
                      className="h-10 w-10 rounded-lg border border-ns-border bg-ns-surface text-lg font-bold text-ns-text"
                    />
                    <InputOTPSlot
                      index={4}
                      className="h-10 w-10 rounded-lg border border-ns-border bg-ns-surface text-lg font-bold text-ns-text"
                    />
                    <InputOTPSlot
                      index={5}
                      className="h-10 w-10 rounded-lg border border-ns-border bg-ns-surface text-lg font-bold text-ns-text"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="new-password">New Password</FieldLabel>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                required
                showPasswordToggle
              />
              <PasswordStrengthIndicator passwordValue={password} />
            </Field>

            <Button
              type="submit"
              disabled={loading}
              className="relative mt-2 w-full cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span>
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </span>
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
      )}
    </AuthCard>
  )
}
