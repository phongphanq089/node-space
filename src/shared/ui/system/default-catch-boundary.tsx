import type { ErrorComponentProps } from '@tanstack/react-router'
import { Link, rootRouteId, useMatch, useRouter } from '@tanstack/react-router'
import { AlertCircle, ChevronLeft, Home, RefreshCw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/core/dialog'
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
    <div className="bg-back flex min-h-screen flex-1 flex-col items-center justify-center p-6 text-center">
      <Dialog open={true}>
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[85vh] flex-col overflow-hidden border-destructive/20 p-0 shadow-2xl sm:max-w-2xl dark:shadow-red-900/10"
          onInteractOutside={(e: Event) => e.preventDefault()}
          onEscapeKeyDown={(e: KeyboardEvent) => e.preventDefault()}
        >
          <div className="border-b border-destructive/20 bg-destructive/10 p-4 dark:bg-destructive/20">
            <DialogHeader className="gap-1 space-y-0 text-left">
              <DialogTitle className="flex items-center gap-2 text-lg font-bold text-destructive">
                <AlertCircle className="h-5 w-5" />
                Unhandled Runtime Error
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-destructive/80">
                An unexpected exception occurred while rendering this page
                component.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-4 text-left">
            <div className="rounded-lg border border-destructive/10 bg-destructive/5 p-3 font-mono text-sm break-all text-destructive dark:bg-destructive/10">
              {errorMessage}
            </div>

            {errorStack && (
              <div className="mt-3">
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Stack Trace
                </span>
                <pre className="mt-1 max-h-48 overflow-x-auto rounded-lg border border-border/40 bg-muted/40 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
                  {errorStack}
                </pre>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col gap-2 border-t border-border/40 bg-muted/20 p-4 sm:flex-row sm:justify-between sm:space-x-0">
            <Button
              variant="ghost"
              onClick={() => router.invalidate()}
              className="w-full text-muted-foreground hover:text-foreground sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Render
            </Button>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              {!isRoot ? (
                <Button
                  variant="outline"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    window.history.back()
                  }}
                  className="flex-1 sm:flex-none"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              ) : (
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 sm:flex-none"
                >
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
              )}

              <Button
                variant="default"
                onClick={() => {
                  router.invalidate()
                }}
                className="flex flex-1 items-center justify-center bg-red-700 text-white hover:bg-red-800 sm:flex-none"
              >
                <RefreshCw className="mr-2" />
                Try Again
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
