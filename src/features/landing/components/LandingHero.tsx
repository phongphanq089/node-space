import { Link } from '@tanstack/react-router'
import CornerCutButton from '@/components/ui/core/neon-button'

export default function LandingHero() {
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center px-6 py-12 md:py-16">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* ── Left: Content ── */}
        <div className="flex flex-col items-start text-left">
          {/* Status badge */}
          <div className="mb-6">
            <img
              src="/logo.png"
              alt="NodeSpace Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="m-0 mb-4 text-[clamp(2.8rem,5.5vw,4.5rem)] leading-[1.05] font-extrabold tracking-[-0.04em] text-white">
            Coming Soon
          </h1>

          {/* Subheading */}
          <p className="m-0 mb-4 text-xl leading-snug font-bold text-white sm:text-2xl">
            A{' '}
            <span className="bg-gradient-to-r from-ns-accent-lt to-ns-purple bg-clip-text text-transparent">
              completely new experience
            </span>{' '}
            is being crafted.
          </p>

          {/* Description */}
          <p className="m-0 mb-8 max-w-[500px] text-sm leading-relaxed text-ns-muted">
            We are building the next-generation workspace for creators and those
            who think differently.
          </p>
          <div className="flex items-center gap-4">
            <CornerCutButton
              as={Link}
              to="/login"
              color="red"
              variant="outline"
            >
              Login
            </CornerCutButton>
            <CornerCutButton
              as={Link}
              to="/register"
              color="pink"
              hoverEffect="pulse"
              glowIntensity="high"
            >
              Get started free
            </CornerCutButton>
          </div>
        </div>

        {/* ── Right: Floating graphic ── */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-72 w-72 rounded-full bg-ns-accent/10 blur-[90px]" />
          <img
            src="/icon-banner.png"
            alt="NodeSpace graphic"
            className="ns-animate-float z-10 max-h-[360px] w-auto object-contain md:max-h-[420px]"
          />
        </div>
      </div>
    </main>
  )
}
