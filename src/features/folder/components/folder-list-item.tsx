import React from 'react'
import {
  Star,
  Trash2,
  Pencil,
  Folder as FolderIcon,
  Check,
  Calendar,
  Clock,
  MoreVertical,
} from 'lucide-react'
import { useToggleFavoriteFolderMutation } from '../hooks/use-folders'
import type { FolderItemRecord } from './folder-card'
import { cn } from '@/shared/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/core/dropdown-menu'

export interface FolderListItemProps {
  folder: FolderItemRecord
  onSelect?: (folder: FolderItemRecord) => void
  onSelectTag?: (tag: string) => void
  onEdit?: (folder: FolderItemRecord) => void
  onDelete?: (folder: FolderItemRecord) => void
  isDeleting?: boolean
  isSelectMode?: boolean
  isSelected?: boolean
  onToggleSelect?: (folderId: string) => void
}

export function FolderListItem({
  folder,
  onSelect,
  onSelectTag,
  onEdit,
  onDelete,
  isDeleting = false,
  isSelectMode = false,
  isSelected = false,
  onToggleSelect,
}: FolderListItemProps) {
  const favoriteMutation = useToggleFavoriteFolderMutation()

  const formattedUpdated = folder.updatedAt
    ? new Date(folder.updatedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently'

  const formattedCreated = folder.createdAt
    ? new Date(folder.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    favoriteMutation.mutate(folder.id)
  }

  const handleRowClick = () => {
    if (isSelectMode) {
      onToggleSelect?.(folder.id)
    } else {
      onSelect?.(folder)
    }
  }

  const folderColor = folder.color || '#6366f1'

  return (
    <div
      onClick={handleRowClick}
      style={
        {
          '--folder-accent': folderColor,
          '--folder-accent-shadow': `${folderColor}20`,
        } as React.CSSProperties
      }
      className={cn(
        'group relative flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--folder-accent)] hover:shadow-md',
        isSelected
          ? 'border-ns-primary bg-ns-primary/10 shadow-sm ring-1 ring-ns-primary/50 dark:bg-ns-primary/15'
          : 'border-ns-border-soft bg-ns-surface/90 hover:bg-ns-surface dark:border-white/10 dark:bg-ns-panel/70 dark:hover:bg-ns-panel'
      )}
    >
      {/* Left side: Checkbox + Folder Thumbnail/Icon + Name + Tags */}
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        {/* Selection Checkbox */}
        {isSelectMode && (
          <div
            onClick={(e) => {
              e.stopPropagation()
              onToggleSelect?.(folder.id)
            }}
            className={cn(
              'flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-all',
              isSelected
                ? 'border-ns-primary bg-ns-primary text-white shadow-xs'
                : 'border-ns-border-md bg-ns-surface-alt hover:border-ns-primary/60 dark:border-white/20 dark:bg-black/30 dark:hover:border-white/50'
            )}
          >
            {isSelected && <Check size={12} strokeWidth={3} />}
          </div>
        )}

        {/* Thumbnail / Color Icon */}
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-ns-border-soft bg-ns-surface-alt shadow-xs dark:border-white/10 dark:bg-black/30">
          {folder.image ? (
            <img
              src={folder.image}
              alt={folder.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${folderColor}15` }}
            >
              <FolderIcon size={19} style={{ color: folderColor }} />
            </div>
          )}
        </div>

        {/* Folder Title & Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold text-ns-text transition-colors group-hover:text-ns-primary dark:text-white dark:group-hover:text-ns-primary-lt">
              {folder.name}
            </span>
          </div>

          {/* Tags */}
          {folder.tags && folder.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {folder.tags.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectTag?.(tag)
                  }}
                  className="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-purple-700 transition-colors hover:bg-purple-500/20 dark:border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-300"
                >
                  #{tag}
                </button>
              ))}
              {folder.tags.length > 3 && (
                <span className="text-[10px] text-ns-ghost">
                  +{folder.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Dates + Favorite + Actions */}
      <div className="flex shrink-0 items-center gap-3">
        {/* Dates (Hidden on small mobile) */}
        <div className="hidden flex-col items-end text-right sm:flex">
          <div className="flex items-center gap-1 text-xs font-medium text-ns-muted">
            <Clock size={11} className="text-ns-ghost" />
            <span>Updated {formattedUpdated}</span>
          </div>
          {formattedCreated && (
            <div className="flex items-center gap-1 text-[11px] text-ns-ghost">
              <Calendar size={10} />
              <span>Created {formattedCreated}</span>
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={favoriteMutation.isPending}
          className={cn(
            'flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-all active:scale-95',
            folder.isFavorite
              ? 'border-amber-500/30 bg-amber-500/15 text-amber-500 shadow-xs dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-400'
              : 'border-ns-border-soft bg-ns-surface-alt text-ns-ghost hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-500 dark:border-white/10 dark:bg-black/30 dark:hover:border-amber-400/30 dark:hover:text-amber-400'
          )}
          title={
            folder.isFavorite ? 'Remove from favorites' : 'Add to favorites'
          }
        >
          <Star
            size={14}
            className={cn(
              folder.isFavorite
                ? 'fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400'
                : 'text-ns-ghost group-hover:text-ns-muted'
            )}
          />
        </button>

        {/* Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-ns-border-soft bg-ns-surface-alt text-ns-muted transition-colors hover:border-ns-border hover:bg-ns-hover hover:text-ns-text dark:border-white/10 dark:bg-black/30 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <MoreVertical size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-36 rounded-2xl border border-ns-border-soft bg-ns-surface/95 p-1 text-ns-text shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#121118]/95 dark:text-white"
          >
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(folder)
              }}
              className="flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <Pencil
                size={13}
                className="text-ns-primary dark:text-blue-400"
              />
              <span>Edit</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(folder)
              }}
              disabled={isDeleting}
              className="flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
