import { createFileRoute, Link } from '@tanstack/react-router'
import { Compass, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/core/button'

export const Route = createFileRoute('/_dashboard/$')({
  component: NotFoundPage,
})

function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-ns-bg text-center px-4 min-h-[70vh]">
      {/* Glow Effect Background */}
      <div className="relative w-full max-w-md flex flex-col items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-600/10 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-indigo-500/10 blur-[60px]" />

        {/* Floating Animated Compass Icon */}
        <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-ns-panel shadow-2xl animate-pulse">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 blur-md opacity-75" />
          <Compass className="relative h-12 w-12 text-violet-400 animate-spin-slow" style={{ animationDuration: '25s' }} />
        </div>

        {/* Error message */}
        <p className="text-[0.65rem] font-bold tracking-[0.25em] text-violet-400 uppercase mb-2">
          Error 404
        </p>
        <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm mb-3">
          Node Space Lost
        </h1>
        <p className="max-w-xs text-xs leading-5 text-ns-muted mb-8">
          The coordinate or node you are trying to access does not exist, has been moved, or resides in another workspace.
        </p>

        {/* CTA Button */}
        <Button asChild className="group cursor-pointer font-bold px-6 py-2">
          <Link to="/dashboard">
            <span>Return to Home</span>
            <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
