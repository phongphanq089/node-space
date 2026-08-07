import { createFileRoute, Link } from '@tanstack/react-router'
import { Compass, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/core/button'

export const Route = createFileRoute('/_workspace/$')({
  component: NotFoundPage,
})

function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-1 flex-col items-center justify-center bg-ns-bg px-4 text-center">
      {/* Glow Effect Background */}
      <div className="relative flex w-full max-w-md flex-col items-center">
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[60px]" />

        {/* Floating Animated Compass Icon */}
        <div className="relative mb-8 flex h-24 w-24 animate-pulse items-center justify-center rounded-2xl border border-white/10 bg-ns-panel shadow-2xl">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 opacity-75 blur-md" />
          <Compass
            className="animate-spin-slow relative h-12 w-12 text-violet-400"
            style={{ animationDuration: '25s' }}
          />
        </div>

        {/* Error message */}
        <p className="mb-2 text-[0.65rem] font-bold tracking-[0.25em] text-violet-400 uppercase">
          Error 404
        </p>
        <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
          Node Space Lost
        </h1>
        <p className="mb-8 max-w-xs text-xs leading-5 text-ns-muted">
          The coordinate or node you are trying to access does not exist, has
          been moved, or resides in another workspace.
        </p>

        {/* CTA Button */}
        <Button asChild className="group cursor-pointer px-6 py-2 font-bold">
          <Link to="/workspace">
            <span>Return to Home</span>
            <ArrowRight
              size={14}
              className="ml-1.5 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Button>
      </div>
    </div>
  )
}
