import { useState } from 'react'
import { Sparkles, CheckCircle2, ArrowRight, Disc } from 'lucide-react'
import { Button } from '@/shared/ui/core/button'
import { Input } from '@/shared/ui/core/input'
import { toast } from 'sonner'

export interface FeatureTeaser {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color?: string
}

export interface ComingSoonProps {
  /** Top badge text, e.g. "NodeSpace Audio Studio · Coming Soon" */
  badge?: string
  /** Main headline title or custom JSX node */
  title?: React.ReactNode
  /** Descriptive body text */
  description?: string
  /** Feature cards to highlight upcoming capabilities */
  features?: FeatureTeaser[]
  /** Target version string, e.g. "v2.0" */
  version?: string
  /** Name of the module/feature for notifications */
  featureName?: string
}

export function ComingSoon({
  badge,
  title,
  description,
  features,
  version = 'v2.0',
  featureName = 'This Feature',
}: ComingSoonProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    setSubscribed(true)
    toast.success('You are on the VIP waitlist!', {
      description: `We will notify you as soon as ${featureName} ${version} launches.`,
    })
  }

  const defaultBadge =
    badge || `NodeSpace ${featureName} · Coming Soon ${version}`
  const defaultTitle = title || (
    <>
      Something Amazing is <br className="hidden sm:inline" />
      <span className="bg-gradient-to-r from-ns-primary-lt via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Under Active Development
      </span>
    </>
  )
  const defaultDesc =
    description ||
    `We are actively working on ${featureName}. Join the early access waitlist to receive launch updates and exclusive beta access.`

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-ns-bg p-6 font-sans sm:p-10 lg:p-16">
      {/* Ambient Glowing Orbs */}
      <div className="ns-orb-purple-20 pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 animate-pulse rounded-full opacity-30 blur-3xl" />
      <div className="ns-orb-pink-25 pointer-events-none absolute right-10 -bottom-40 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl" />

      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        {/* Coming Soon Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ns-primary/40 bg-ns-primary/10 px-4 py-1.5 text-xs font-bold text-ns-primary-lt shadow-lg shadow-ns-primary/10 backdrop-blur-xl">
          <Disc
            className="size-4 animate-spin text-ns-primary-lt"
            style={{ animationDuration: '6s' }}
          />
          <span>{defaultBadge}</span>
        </div>

        {/* Headline & Subtitle */}
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {defaultTitle}
        </h1>

        <p className="mb-8 max-w-2xl text-xs leading-relaxed text-ns-muted sm:text-sm md:text-base">
          {defaultDesc}
        </p>

        {/* Feature Teasers Grid (if provided) */}
        {features && features.length > 0 && (
          <div className="mb-10 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
            {features.map((feat, idx) => {
              const Icon = feat.icon
              return (
                <div
                  key={idx}
                  className="group rounded-2xl border border-ns-border-soft bg-ns-panel/60 p-5 backdrop-blur-xl transition-all hover:border-ns-primary/50 hover:bg-ns-panel hover:shadow-2xl"
                >
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl border border-ns-primary/30 bg-ns-primary/15 text-ns-primary-lt">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold text-white group-hover:text-ns-primary-lt">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-ns-muted">{feat.description}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* Waitlist Subscription Form */}
        <div className="w-full max-w-md rounded-2xl border border-ns-border-md bg-ns-surface/80 p-6 shadow-2xl backdrop-blur-2xl">
          {subscribed ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <CheckCircle2 className="size-8 text-emerald-400" />
              <p className="text-sm font-bold text-white">
                You&apos;re on the Early Access List!
              </p>
              <p className="text-xs text-ns-muted">
                We&apos;ll notify {email} as soon as {version} is live.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-ns-muted">
                <span className="font-semibold text-white">
                  Get Notified at Launch
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Sparkles className="size-3" />
                  <span>VIP Early Access</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="enter your email..."
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  className="flex-1"
                />
                <Button type="submit" className="shrink-0 font-semibold">
                  <span>Notify Me</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
