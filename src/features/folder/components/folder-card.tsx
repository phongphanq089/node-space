import React from 'react'
import { Star, Trash2, Pencil } from 'lucide-react'
import { useToggleFavoriteFolderMutation } from '../hooks/use-folders'
import { Button } from '@/shared/ui/core/button'

export interface FolderItemRecord {
  id: string
  name: string
  color?: string | null
  image?: string | null
  isFavorite?: boolean
  tags?: string[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

interface FolderCardProps {
  folder: FolderItemRecord
  onSelect?: (folder: FolderItemRecord) => void
  onSelectTag?: (tag: string) => void
  onEdit?: (folder: FolderItemRecord) => void
  onDelete?: (folder: FolderItemRecord) => void
  isDeleting?: boolean
}

function FolderCardComponent({
  folder,
  onSelect,
  onSelectTag,
  onEdit,
  onDelete,
  isDeleting = false,
}: FolderCardProps) {
  const favoriteMutation = useToggleFavoriteFolderMutation()

  const formattedDate = folder.createdAt
    ? new Date(folder.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently'

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(folder)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(folder)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    favoriteMutation.mutate(folder.id)
  }

  const folderColor = folder.color || '#6366f1'

  return (
    <div
      onClick={() => onSelect?.(folder)}
      style={
        {
          '--folder-accent': folderColor,
          '--folder-accent-shadow': `${folderColor}33`,
          '--folder-accent-glow': `${folderColor}4d`,
        } as React.CSSProperties
      }
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-ns-border bg-gray-100 p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[var(--folder-accent)] hover:shadow-[var(--folder-accent-shadow)] hover:ring-1 hover:ring-[var(--folder-accent)]/40 dark:border-white/10 dark:bg-ns-primary/10! dark:hover:border-[var(--folder-accent)] dark:hover:shadow-[0_0_30px_var(--folder-accent-glow)] dark:hover:ring-1 dark:hover:ring-[var(--folder-accent)]/70"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-ns-surface-alt transition-colors duration-300">
        {folder.image ? (
          <img
            src={folder.image}
            alt={folder.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center bg-ns-primary/10">
              <img
                src={'/icon-ui-v1.png'}
                alt={folder.name}
                className="h-[80%] w-[80%] object-contain transition-opacity duration-300 group-hover:opacity-80"
              />
            </div>
          </>
        )}

        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={favoriteMutation.isPending}
          className="absolute top-2.5 right-2.5 z-10 flex size-8 cursor-pointer items-center justify-center rounded-lg border border-black/10 bg-white/85 text-ns-muted shadow-xs backdrop-blur-md transition-all hover:scale-110 hover:border-amber-400/60 hover:bg-white hover:text-amber-500 active:scale-95 dark:border-white/15 dark:bg-black/55 dark:text-ns-ghost dark:hover:border-amber-400/40 dark:hover:bg-black/80 dark:hover:text-amber-400"
          title={
            folder.isFavorite ? 'Remove from favorites' : 'Add to favorites'
          }
        >
          <Star
            size={14}
            fill={folder.isFavorite ? '#fbbf24' : 'none'}
            className={
              folder.isFavorite
                ? 'text-amber-500 dark:text-amber-400'
                : 'text-zinc-500 dark:text-white/75'
            }
          />
        </button>
      </div>

      <div className="mt-3.5 flex flex-1 flex-col">
        {/* Tags row */}
        <div className="flex items-center gap-1.5">
          {folder.tags && folder.tags.length > 0 ? (
            <>
              {folder.tags.slice(0, 2).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectTag?.(tag)
                  }}
                  className="max-w-[110px] truncate rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-purple-700 transition-colors hover:border-purple-300 hover:bg-purple-100 hover:text-purple-900 dark:border-purple-500/25 dark:bg-purple-500/10 dark:text-purple-300 dark:hover:border-purple-500/50 dark:hover:bg-purple-500/20 dark:hover:text-white"
                  title={`Filter by #${tag}`}
                >
                  #{tag}
                </button>
              ))}
              {folder.tags.length > 2 && (
                <span className="text-[10px] font-medium text-ns-muted dark:text-ns-faint">
                  +{folder.tags.length - 2}
                </span>
              )}
            </>
          ) : (
            <span className="rounded-md border border-ns-border-soft bg-ns-surface-alt px-2 py-0.5 font-mono text-[10px] font-medium text-ns-muted dark:border-ns-border/40 dark:bg-ns-surface/50 dark:text-ns-faint">
              #folder
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-5 line-clamp-1 text-lg font-semibold tracking-tight text-ns-text transition-colors group-hover:text-[var(--folder-accent)] dark:text-white dark:group-hover:text-[var(--folder-accent)]">
          {folder.name}
        </h3>

        {/* Subtitle / Description */}
        <p className="mt-1 line-clamp-2 text-base leading-relaxed text-ns-muted">
          {folder.tags && folder.tags.length > 0
            ? `Tagged with ${folder.tags.map((t) => `#${t}`).join(', ')}`
            : 'Organized workspace folder for notes and documents.'}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-ns-border-soft pt-3 dark:border-ns-border-soft/40">
          <div className="flex items-center gap-2 text-[11px] text-ns-muted dark:text-ns-muted-md">
            <div
              className="flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white shadow-xs"
              style={{ backgroundColor: folderColor }}
            >
              {folder.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center gap-1">
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 text-ns-muted dark:text-ns-ghost">
            <Button
              size="icon-lg"
              type="button"
              onClick={handleEdit}

              title="Edit Folder"
            >
              <Pencil size={13} />
            </Button>
            <Button
              size="icon-lg"
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete Folder"
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const FolderCard = React.memo(FolderCardComponent)
