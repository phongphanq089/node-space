import type { ErrorComponentProps } from '@tanstack/react-router'
import { Link, rootRouteId, useMatch, useRouter } from '@tanstack/react-router'
import { AlertCircle, ChevronLeft, Home, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/ui/core/button'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error('Caught error in DefaultCatchBoundary: ', error)

  const errorMessage =
    error instanceof Error ? error.message : 'An unknown error occurred'
  const errorStack = error instanceof Error ? error.stack : undefined

  return (
    <div className="flex min-h-[75vh] w-full flex-1 flex-col items-center justify-center bg-ns-bg p-4 font-sans text-ns-text sm:p-6">
      {/* Subtle Glow orb background */}
      <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-xl flex-col gap-5 rounded-lg border border-red-500/30 bg-ns-panel/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        <div className="flex items-center gap-3 border-b border-ns-border-soft pb-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-red-500/30 bg-red-500/10 text-red-400 shadow-inner">
            <AlertCircle size={20} />
          </div>
          <div className="flex flex-col text-left">
            <h2 className="text-base font-extrabold text-white sm:text-lg">
              Application Runtime Error
            </h2>
            <p className="text-xs text-ns-faint">
              An unexpected exception occurred while rendering this page
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-left">
          <div className="rounded-sm border border-red-500/20 bg-red-500/10 p-3.5 font-mono text-xs font-semibold break-all text-red-300 shadow-inner">
            {errorMessage}
          </div>

          {errorStack && (
            <div className="flex flex-col gap-1 pt-1">
              <span className="font-mono text-[0.65rem] font-bold tracking-wider text-ns-ghost uppercase">
                Stack Trace
              </span>
              <pre className="max-h-44 overflow-x-auto rounded-xl border border-ns-border-soft bg-ns-bg/80 p-3 font-mono text-[0.7rem] leading-relaxed text-ns-muted">
                {errorStack}
              </pre>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-ns-border-soft pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            onClick={() => router.invalidate()}
            className="flex items-center justify-center gap-1.5 border-ns-border-soft text-xs text-ns-muted hover:text-white"
          >
            <RefreshCw size={13} />
            <span>Retry Render</span>
          </Button>

          <div className="flex items-center gap-2">
            {!isRoot ? (
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="flex items-center gap-1.5 border-ns-border-soft text-xs text-ns-muted hover:text-white"
              >
                <ChevronLeft size={13} />
                <span>Go Back</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                asChild
                className="flex items-center gap-1.5 border-ns-border-soft text-xs text-ns-muted hover:text-white"
              >
                <Link to="/">
                  <Home size={13} />
                  <span>Home</span>
                </Link>
              </Button>
            )}

            <Button
              onClick={() => router.invalidate()}
              className="flex items-center gap-1.5 bg-red-600 text-xs font-bold text-white shadow-md transition-all hover:bg-red-700 active:scale-95"
            >
              <RefreshCw size={13} />
              <span>Try Again</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
