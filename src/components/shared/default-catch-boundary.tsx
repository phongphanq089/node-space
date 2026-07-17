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
} from '../ui/core/dialog'
import { Button } from '../ui/core/button'

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
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="border-b border-destructive/20 bg-destructive/10 p-4 dark:bg-destructive/20">
            <DialogHeader className="gap-1 space-y-0 text-left">
              <DialogTitle className="flex items-center gap-2 text-lg font-bold text-destructive">
                <AlertCircle className="h-5 w-5" />
                Unhandled Runtime Error
              </DialogTitle>
              <DialogDescription className="font-medium text-destructive/80">
                The application encountered an unexpected error.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="custom-scrollbar relative flex-1 overflow-auto bg-zinc-950 p-6 text-left shadow-inner">
            <div className="absolute top-2 right-4 text-xs text-zinc-500 opacity-50">
              Trace
            </div>
            <h3 className="mb-4 text-sm leading-relaxed font-semibold text-red-400 md:text-base">
              {errorMessage}
            </h3>
            {errorStack && (
              <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-xs leading-relaxed whitespace-pre-wrap text-zinc-400">
                {errorStack}
              </pre>
            )}
          </div>

          <DialogFooter className="m-0 flex-wrap items-center gap-4 border-t bg-muted/50 p-4 sm:items-end sm:justify-between sm:gap-2">
            <div className="text-left text-xs text-muted-foreground/70">
              Check the browser console for more details.
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              {!isRoot ? (
                <Button
                  variant="outline"
                  onClick={(e) => {
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
