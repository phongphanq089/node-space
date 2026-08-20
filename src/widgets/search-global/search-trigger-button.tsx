import { Search } from 'lucide-react'

interface SearchTriggerButtonProps {
  onClick: () => void
  className?: string
  placeholder?: string
}

export function SearchTriggerButton({
  onClick,
  className,
  placeholder = 'Search nodes, notes, actions...',
}: SearchTriggerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        className ||
        'group relative flex w-full max-w-xl items-center gap-3 rounded-md border border-border bg-background/80 px-3.5 py-2 text-left shadow-md backdrop-blur-xl transition-all hover:border-primary/50 hover:bg-muted/40 focus:outline-none dark:border-ns-border dark:bg-ns-input/50 dark:hover:border-ns-primary/60 dark:hover:bg-ns-hover/30'
      }
    >
      <Search className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary dark:text-ns-ghost dark:group-hover:text-ns-primary-lt" />
      <span className="flex-1 truncate text-xs text-muted-foreground sm:text-sm dark:text-ns-muted">
        {placeholder}
      </span>
      <kbd className="hidden shrink-0 items-center gap-1 rounded-sm border border-border bg-primary px-2 py-0.5 text-[0.65rem] font-bold text-white shadow-inner sm:inline-flex dark:border-ns-border-soft dark:bg-ns-primary">
        ⌘K
      </kbd>
    </button>
  )
}
