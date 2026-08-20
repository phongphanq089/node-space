import { Sparkles } from 'lucide-react'

interface DialogFooterProps {
  resultCount: number
}

export function DialogFooter({ resultCount }: DialogFooterProps) {
  return (
    <div className="flex shrink-0 items-center justify-between border-t border-border/60 bg-background/95 px-4 py-2 text-[0.68rem] text-muted-foreground backdrop-blur-md dark:border-ns-border-soft/60 dark:bg-ns-panel/95 dark:text-ns-muted">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-border bg-background/60 px-1 font-mono text-[0.6rem] dark:border-ns-border-soft dark:bg-ns-bg/60">
            ↑↓
          </kbd>
          <span>Navigate</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-border bg-background/60 px-1 font-mono text-[0.6rem] dark:border-ns-border-soft dark:bg-ns-bg/60">
            ↵
          </kbd>
          <span>Select</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-border bg-background/60 px-1 font-mono text-[0.6rem] dark:border-ns-border-soft dark:bg-ns-bg/60">
            Esc
          </kbd>
          <span>Close</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {resultCount > 0 && (
          <span className="text-[0.6rem] text-muted-foreground dark:text-ns-faint">
            {resultCount} results
          </span>
        )}
        <div className="flex items-center gap-1.5 text-muted-foreground dark:text-ns-ghost">
          <Sparkles className="size-3 animate-pulse text-primary dark:text-ns-primary-lt" />
          <span>NodeSpace Intelligence</span>
        </div>
      </div>
    </div>
  )
}
