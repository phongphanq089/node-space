import BrandLogo from '@/components/shared/logo'

type AuthCardProps = {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ns-bg px-4 font-sans">
      {/* Ambient orbs */}
      <div
        aria-hidden
        className="ns-orb-accent-20-blur pointer-events-none fixed -top-40 -left-20 h-[500px] w-[500px] rounded-full opacity-40"
      />
      <div
        aria-hidden
        className="ns-orb-purple-20-blur pointer-events-none fixed -right-20 -bottom-40 h-[500px] w-[500px] rounded-full opacity-30"
      />

      {/* Card */}
      <div className="rise-in relative z-10 w-full max-w-[420px]">
        <div className="rounded-2xl border border-ns-border-md bg-ns-surface p-8 shadow-[0_24px_64px_rgba(0,0,0,.5)] backdrop-blur-xl">
          <div className="mb-7">
            <BrandLogo />
          </div>

          <h1 className="mb-1 text-xl font-bold text-ns-text">{title}</h1>
          <p className="mb-6 text-sm text-ns-muted-md">{subtitle}</p>

          {children}

          <p className="mt-5 text-center text-xs text-ns-muted-sm">{footer}</p>
        </div>
      </div>
    </div>
  )
}
