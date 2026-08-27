import React from 'react'
import { FileText, Star, Pencil, Trash2 } from 'lucide-react'
import type { NoteItem as NoteItemType } from '../types'
import { cn } from '@/shared/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui'

export interface NoteItemProps {
  note: NoteItemType
  isActive?: boolean
  onSelect: (note: NoteItemType) => void
  onEdit?: (note: NoteItemType) => void
  onDelete?: (note: NoteItemType) => void
  className?: string
}

export function NoteItem({
  note,
  isActive = false,
  onSelect,
  onEdit,
  onDelete,
  className,
}: NoteItemProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(note)
    }
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(note)}
        onKeyDown={handleKeyDown}
        className={cn(
          'group relative flex w-full cursor-pointer items-center gap-2.5 rounded-xl border p-2 text-left transition-all duration-200 outline-none select-none focus-visible:ring-1 focus-visible:ring-ns-primary',
          isActive
            ? 'border-ns-primary/60 bg-ns-primary/10 shadow-xs dark:border-ns-primary/50 dark:bg-ns-primary/15'
            : 'border-ns-border-soft/60 bg-ns-surface/70 hover:border-ns-border-md hover:bg-ns-hover/60 dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/10 dark:hover:bg-white/[0.05]',
          className
        )}
        title={note.title}
      >
        {/* {isActive && (
          <div className="absolute -left-[1px] top-2 bottom-2 w-1 rounded-r-full bg-ns-primary shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
        )} */}
        <div
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors',
            isActive
              ? 'border-ns-primary/40 bg-ns-primary/20 text-ns-primary dark:border-ns-primary/50 dark:text-ns-primary-lt'
              : 'border-ns-border-soft/80 bg-ns-surface-alt text-ns-muted group-hover:border-ns-border group-hover:text-ns-text dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:group-hover:text-zinc-200'
          )}
        >
          <FileText size={13} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span
              className={cn(
                'truncate text-xs font-semibold transition-colors',
                isActive
                  ? 'font-bold text-ns-primary dark:text-ns-primary-lt'
                  : 'text-ns-text group-hover:text-ns-primary dark:text-zinc-200 dark:group-hover:text-white'
              )}
            >
              {note.title}
            </span>
            {note.starred && (
              <Star
                size={11}
                className="shrink-0 fill-amber-400 text-amber-400 dark:fill-amber-400 dark:text-amber-400"
              />
            )}
          </div>
          <div className="mt-0.5 flex items-center justify-between gap-1.5">
            <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
              <span className="shrink-0 text-[10px] font-medium text-ns-muted dark:text-zinc-500">
                {note.updated}
              </span>
              {note.tags && note.tags.length > 0 && (
                <div className="flex min-w-0 items-center gap-1 overflow-hidden">
                  {note.tags.slice(0, 1).map((tag) => (
                    <span
                      key={tag}
                      className="py-0.2 truncate rounded border border-purple-500/20 bg-purple-500/10 px-1.5 font-mono text-[9px] font-semibold text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-300"
                    >
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 1 && (
                    <span className="text-[9px] font-medium text-ns-ghost">
                      +{note.tags.length - 1}
                    </span>
                  )}
                </div>
              )}
            </div>

            {(onEdit || onDelete) && (
              <div
                className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                {onEdit && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(note)
                        }}
                        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-ns-muted transition-colors hover:bg-ns-hover hover:text-ns-text dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                        aria-label="Edit Note Properties"
                      >
                        <Pencil size={10} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Edit Note</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {onDelete && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(note)
                        }}
                        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-ns-muted transition-colors hover:bg-red-500/15 hover:text-red-500 dark:text-zinc-400 dark:hover:bg-red-500/20 dark:hover:text-red-400"
                        aria-label="Delete Note"
                      >
                        <Trash2 size={10} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Delete Note</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
