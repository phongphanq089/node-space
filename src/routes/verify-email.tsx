import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { getSessionFn } from '@/features/auth/auth.fns'
import AuthCard from '@/features/auth/components/AuthCard'
import { Button } from '@/components/ui/core/button'
import { DotmCircular } from '@/components/ui/core/dotm-circular'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/core/input-otp'
import { signOut, authClient } from '@/lib/auth-client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/verify-email')({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session) {
      throw redirect({
        to: '/login',
      })
    }
    // If already verified, send them straight to the dashboard

    console.log(session.user.emailVerified, 'session.user.emailVerified')
    if (session.user.emailVerified) {
      throw redirect({
        to: '/dashboard',
      })
    }
    return {
      session,
    }
  },
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const { session } = Route.useRouteContext()
  const navigate = useNavigate()
  const router = useRouter()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  // Automatically trigger check when OTP reaches 6 digits
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify(otp)
    }
  }, [otp])

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || otp
    if (code.length !== 6) {
      toast.error('Please enter a 6-digit verification code')
      return
    }

    setVerifying(true)
    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email: session.user.email,
        otp: code,
      })

      if (error) {
        toast.error('Verification failed', {
          description:
            error.message || 'The verification code is incorrect or expired.',
        })
      } else {
        toast.success('Email verified successfully!')
        // Force the router to reload session data before navigating
        await router.invalidate()
        navigate({ to: '/dashboard' })
      }
    } catch (err: any) {
      toast.error('An error occurred during verification')
    } finally {
      setVerifying(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    try {
      await authClient.emailOtp.sendVerificationOtp(
        {
          email: session.user.email,
          type: 'email-verification',
        },
        {
          onSuccess: () => {
            toast.success('Verification code sent!', {
              description: 'Please check your inbox (and spam folder).',
            })
            setCooldown(60)
          },
          onError: (ctx) => {
            toast.error('Failed to send code', {
              description: ctx.error.message,
            })
          },
        }
      )
    } catch (err: any) {
      toast.error('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            navigate({ to: '/login' })
          },
        },
      })
    } catch (err) {
      toast.error('Failed to log out')
    }
  }

  return (
    <AuthCard
      title="Enter Verification Code"
      subtitle={`We've sent a 6-digit verification code to ${session.user.email}.`}
      footer={
        <button
          onClick={handleSignOut}
          className="cursor-pointer font-semibold text-ns-primary-lt no-underline transition-colors hover:text-ns-primary"
        >
          Sign out / Use another account
        </button>
      }
    >
      <div className="flex flex-col gap-5 text-center">
        <p className="text-sm text-ns-text-2">
          Please enter the code below to verify your account.
        </p>

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            disabled={verifying}
            onChange={(val) => setOtp(val.replace(/\D/g, ''))}
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

        <Button
          onClick={() => handleVerify()}
          disabled={verifying || otp.length !== 6}
          className="relative w-full cursor-pointer"
        >
          <div className="flex items-center justify-center gap-3">
            <span>{verifying ? 'Verifying...' : 'Verify Code'}</span>
            {verifying && (
              <div className="absolute top-1/2 right-2 -translate-y-1/2">
                <DotmCircular size={26} dotSize={4} speed={1.2} bloom />
              </div>
            )}
          </div>
        </Button>

        <div className="text-xs text-ns-muted">
          Didn't receive the code?{' '}
          <button
            onClick={handleResend}
            disabled={loading || cooldown > 0}
            className="font-semibold text-ns-primary-lt hover:text-ns-primary disabled:pointer-events-none disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}
          </button>
        </div>
      </div>
    </AuthCard>
  )
}
