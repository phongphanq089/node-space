import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/core/dropdown-menu'
import {
  CheckCircle2,
  Check,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export type SortField = 'name' | 'lastViewed' | 'createdAt' | 'updatedAt'
export type SortDirection = 'asc' | 'desc'

export interface FolderSortMenuProps {
  sortBy: SortField
  sortDirection: SortDirection
  onSortChange: (field: SortField, direction: SortDirection) => void
  isSelectMode: boolean
  onToggleSelectMode: () => void
  className?: string
}

const SORT_OPTIONS: { id: SortField; label: string }[] = [
  { id: 'name', label: 'Name' },
  { id: 'lastViewed', label: 'Last Viewed' },
  { id: 'createdAt', label: 'Date Created' },
  { id: 'updatedAt', label: 'Date Updated' },
]

export function FolderSortMenu({
  sortBy,
  sortDirection,
  onSortChange,
  isSelectMode,
  onToggleSelectMode,
  className,
}: FolderSortMenuProps) {
  const handleSelectSort = (field: SortField) => {
    if (sortBy === field) {
      // Toggle direction if already active
      onSortChange(field, sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Default to descending for dates, ascending for name
      onSortChange(field, field === 'name' ? 'asc' : 'desc')
    }
  }

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.id === sortBy)?.label || 'Date Updated'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-9 flex-shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-ns-border/70 bg-ns-surface px-3 text-xs font-semibold whitespace-nowrap text-ns-text shadow-xs transition-all hover:border-ns-border-em hover:bg-ns-hover hover:text-ns-text active:scale-95 dark:bg-ns-panel dark:hover:text-white',
            className
          )}
        >
          <ArrowUpDown size={13} className="flex-shrink-0 text-ns-muted" />
          <span className="hidden text-ns-muted sm:inline">Sort:</span>
          <span className="font-bold text-ns-text dark:text-white">
            {currentSortLabel}
          </span>
          {sortDirection === 'asc' ? (
            <ArrowUp
              size={12}
              className="flex-shrink-0 text-ns-primary dark:text-ns-primary-lt"
            />
          ) : (
            <ArrowDown
              size={12}
              className="flex-shrink-0 text-ns-primary dark:text-ns-primary-lt"
            />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 rounded-2xl border border-ns-border-soft bg-ns-surface/95 p-1.5 text-ns-text shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#121118]/95 dark:text-white"
      >
        {/* Select Action */}
        <DropdownMenuItem
          onClick={onToggleSelectMode}
          className={cn(
            'flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors',
            isSelectMode
              ? 'bg-ns-primary/15 text-ns-primary dark:bg-ns-primary/20 dark:text-ns-primary-lt'
              : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white'
          )}
        >
          <CheckCircle2
            size={16}
            className={
              isSelectMode
                ? 'text-ns-primary dark:text-ns-primary-lt'
                : 'text-ns-ghost dark:text-zinc-400'
            }
          />
          <span>{isSelectMode ? 'Exit Selection' : 'Select'}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5 bg-ns-border-soft dark:bg-white/10" />

        {/* Sort By Label */}
        <DropdownMenuLabel className="px-3 py-1 text-[0.7rem] font-bold tracking-wider text-ns-muted uppercase dark:text-zinc-400">
          Sort by
        </DropdownMenuLabel>

        {/* Sort Options */}
        {SORT_OPTIONS.map((option) => {
          const isActive = sortBy === option.id
          return (
            <DropdownMenuItem
              key={option.id}
              onClick={() => handleSelectSort(option.id)}
              className={cn(
                'flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-ns-primary/10 font-bold text-ns-primary dark:bg-white/10 dark:text-white'
                  : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white'
              )}
            >
              <div className="flex items-center gap-2">
                {isActive ? (
                  <Check
                    size={14}
                    className="text-ns-primary dark:text-white"
                    strokeWidth={2.5}
                  />
                ) : (
                  <span className="w-3.5" />
                )}
                <span>{option.label}</span>
              </div>

              {isActive && (
                <span className="text-ns-muted dark:text-zinc-400">
                  {sortDirection === 'asc' ? (
                    <ArrowUp size={13} strokeWidth={2.5} />
                  ) : (
                    <ArrowDown size={13} strokeWidth={2.5} />
                  )}
                </span>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
