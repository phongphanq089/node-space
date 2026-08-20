import { Link } from '@tanstack/react-router'
import { Button } from '@/shared/ui/core/button'
import { TimelineAnimation } from './TimelineAnimation'
import React from 'react'
import { useMediaBreakpoint } from '@/shared/hooks'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'
import { SideRays } from '@/shared/ui'

export default function LandingHero() {
  const timelineRef = React.useRef<HTMLDivElement>(null)

  const isMobile = useMediaBreakpoint()
  return (
    <section
      ref={timelineRef}
      className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#07050e]"
    >
      {/* ── Luxury Dark Mode Mesh Gradient Background ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#07050e]" />
        <div className="absolute -top-32 -right-24 h-[650px] w-[650px] animate-pulse rounded-full bg-gradient-to-br from-violet-600/35 via-purple-700/25 to-transparent blur-[140px] [animation-duration:10s]" />
        <div className="absolute -bottom-40 left-1/4 h-[580px] w-[750px] animate-pulse rounded-full bg-gradient-to-r from-indigo-600/30 via-blue-600/25 to-purple-600/20 blur-[150px] [animation-duration:13s]" />
        <div className="absolute -bottom-24 -left-20 h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-tr from-cyan-500/30 via-teal-400/20 to-transparent blur-[120px] [animation-duration:12s]" />
        <div className="absolute -bottom-10 left-4 h-[320px] w-[320px] rounded-full bg-pink-500/20 blur-[100px]" />
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-900/10 blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-screen"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <SideRays
        speed={2.5}
        rayColor1="#ae8810"
        rayColor2="#96c8ff"
        intensity={2}
        spread={2}
        origin="top-right"
        tilt={-18}
        saturation={1.25}
        blend={0.6}
        falloff={2.5}
        opacity={1}
      />
      {/* Navigation */}
      {!isMobile && (
        <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
          <nav className="flex items-center gap-8 rounded-full border border-white/20 bg-black/50 px-6 py-3 shadow-xs backdrop-blur-xl">
            <div className="text-2xl font-extrabold">
              <img
                src="/logo.png"
                alt="NodeSpace Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <nav className="hidden items-center gap-6 text-sm font-semibold text-white md:flex">
              <a
                href="#features"
                className="transition-colors hover:text-white"
              >
                Features
              </a>
              <a
                href="#workspaces"
                className="transition-colors hover:text-white"
              >
                Workspaces
              </a>
              <a href="#focus" className="transition-colors hover:text-white">
                Focus Audio
              </a>
              <Link
                to="/design-system"
                className="transition-colors hover:text-white"
              >
                Design System
              </Link>
            </nav>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started Free</Link>
            </Button>
          </div>
        </header>
      )}

      {/* Hero Body */}
      <div className="relative z-10 px-4 pt-14 pb-10 text-center">
        <TimelineAnimation
          as="h1"
          animationNum={3}
          timelineRef={timelineRef}
          className="mb-6 text-4xl leading-[1.1] font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          Capture Ideas & Notes <br className="hidden sm:inline-block" />
          With{' '}
          <TimelineAnimation
            as="span"
            animationNum={4}
            timelineRef={timelineRef}
            className="relative inline-block rounded-md border border-ns-primary/60 bg-ns-primary/15 px-4 py-1 text-white shadow-[0_0_25px_rgba(124,58,237,0.3)]"
          >
            Smart Workspaces
            <div className="absolute -top-1.5 -left-1.5 h-2 w-2 border border-ns-primary bg-white"></div>
            <div className="absolute -top-1.5 -right-1.5 h-2 w-2 border border-ns-primary bg-white"></div>
            <div className="absolute -bottom-1.5 -left-1.5 h-2 w-2 border border-ns-primary bg-white"></div>
            <div className="absolute -right-1.5 -bottom-1.5 h-2 w-2 border border-ns-primary bg-white"></div>
          </TimelineAnimation>
        </TimelineAnimation>

        <TimelineAnimation
          as="p"
          animationNum={5}
          timelineRef={timelineRef}
          className="mx-auto mb-8 max-w-2xl text-base leading-relaxed font-normal text-ns-muted sm:text-lg md:text-xl"
        >
          A fast, distraction-free thinking environment. Organize complex
          knowledge with nested folders, smart tagging, ambient focus
          soundscapes, and personalized dark themes.
        </TimelineAnimation>

        <div className="flex flex-col items-center gap-5">
          <TimelineAnimation
            as="div"
            animationNum={6}
            timelineRef={timelineRef}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="h-13 rounded-xl px-10">
              <Link to="/register">
                Start Writing for Free
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-13 cursor-pointer rounded-xl px-10"
            >
              <Link to="/design-system">Explore Component System</Link>
            </Button>
          </TimelineAnimation>

          <TimelineAnimation
            as="div"
            animationNum={6}
            timelineRef={timelineRef}
            className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-medium text-ns-muted"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-ns-primary-lt" /> Free Forever
              Plan
            </span>
            <span className="text-zinc-700">·</span>
            <span className="flex items-center gap-1.5">
              <Zap className="size-3.5 text-emerald-400" /> Instant Cloud Sync
            </span>
            <span className="text-zinc-700">·</span>
            <span>No Credit Card Required</span>
          </TimelineAnimation>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="relative mx-auto mt-6 w-full max-w-[1200px] px-4 pb-16">
        <TimelineAnimation
          animationNum={7}
          timelineRef={timelineRef}
          className="rounded-3xl border border-ns-primary bg-ns-primary/30 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-4"
        >
          <TimelineAnimation
            animationNum={8}
            as="img"
            timelineRef={timelineRef}
            src={'/hero-banner.png'}
            alt="Note Flow Workspace Dashboard Preview"
            className="relative z-4 w-full rounded-2xl border border-white/10 shadow-2xl"
          />
        </TimelineAnimation>
      </div>
    </section>
  )
}
