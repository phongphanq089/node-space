import type { ChangeEvent } from 'react'
import { Search, Plus, X } from 'lucide-react'
import { Button } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

export interface FolderSearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  onCreateFolder?: () => void
  placeholder?: string
  className?: string
  variant?: 'default' | 'banner'
  hideCreateButton?: boolean
}

export function FolderSearchBar({
  search,
  onSearchChange,
  onCreateFolder,
  placeholder = 'Search folders...',
  className,
  variant = 'default',
  hideCreateButton = false,
}: FolderSearchBarProps) {
  const isBanner = variant === 'banner'

  return (
    <div
      className={cn(
        'flex w-full items-center gap-3',
        !isBanner && 'pb-5',
        className
      )}
    >
      <div className="relative flex w-full flex-1 items-center">
        {/* Search Icon */}
        <div className="pointer-events-none absolute left-3.5 z-10 flex items-center text-white/50">
          <Search size={15} />
        </div>

        {/* Input */}
        <input
          type="text"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          placeholder={placeholder}
          className={cn(
            'h-11 w-full rounded-xl pr-10 pl-10 text-sm font-medium text-white transition-all duration-200 outline-none placeholder:text-white/40',
            isBanner
              ? 'border border-white/20 bg-black/40 shadow-lg backdrop-blur-md focus:border-ns-primary-lt focus:bg-black/60 focus:ring-2 focus:ring-ns-primary/30'
              : 'border border-ns-border/70 bg-ns-panel/60 shadow-sm focus:border-ns-primary focus:bg-ns-panel focus:ring-2 focus:ring-ns-primary/20'
          )}
        />

        {/* Clear Button */}
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            title="Clear search"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {!hideCreateButton && onCreateFolder && (
        <Button
          onClick={onCreateFolder}
          className={cn(
            'flex h-11 shrink-0 items-center gap-2 rounded-xl px-5 font-bold shadow-md transition-all active:scale-95',
            isBanner
              ? 'border border-white/20 bg-ns-primary text-white hover:bg-ns-primary/90'
              : ''
          )}
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Folder</span>
        </Button>
      )}
    </div>
  )
}
