import React from 'react'
import { Star, Trash2, Clock, ArrowRight, Folder, Pencil } from 'lucide-react'
import { GlowCard } from '@/shared/ui/system/glow-card-grid'
import { useToggleFavoriteFolderMutation } from '../hooks/use-folders'
import { Button } from '@/shared/ui'

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

  return (
    <GlowCard avatar={folder.image || undefined} className="cursor-pointer">
      <div
        onClick={() => onSelect?.(folder)}
        className="group flex gap-3.5 p-3.5"
      >
        {/* Thumbnail */}
        {folder.image ? (
          <img
            src={folder.image}
            alt={folder.name}
            className="size-[76px] shrink-0 rounded-xl border border-ns-border object-cover shadow-sm transition-all group-hover:border-ns-border-md"
          />
        ) : (
          <div
            className="flex size-[76px] shrink-0 items-center justify-center rounded-xl border border-ns-border shadow-inner transition-all group-hover:border-ns-border-md"
            style={{
              background: `linear-gradient(
          135deg,
          ${folder.color ?? '#3b82f6'}22,
          ${folder.color ?? '#3b82f6'}44
        )`,
            }}
          >
            <Folder
              size={28}
              style={{ color: folder.color ?? '#60a5fa' }}
              className="drop-shadow-md"
            />
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Title */}
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 truncate text-sm font-bold text-white transition-colors group-hover:text-ns-primary-lt">
              {folder.name}
            </h3>

            <button
              onClick={handleToggleFavorite}
              disabled={favoriteMutation.isPending}
              className="shrink-0 cursor-pointer rounded-md p-1 text-ns-ghost transition-all hover:bg-ns-hover hover:text-amber-400"
              title={
                folder.isFavorite ? 'Remove from favorites' : 'Add to favorites'
              }
            >
              <Star
                size={13}
                fill={folder.isFavorite ? '#fbbf24' : 'none'}
                className={
                  folder.isFavorite ? 'text-amber-400' : 'text-ns-ghost'
                }
              />
            </button>
          </div>
          <div className="mt-1 flex min-w-0 items-center gap-2">
            {/* Date */}
            <div className="flex shrink-0 items-center gap-1.5 text-[10px] text-ns-faint">
              <Clock size={11} />
              <span>Created {formattedDate}</span>
            </div>

            {/* Tags */}
            {folder.tags && folder.tags.length > 0 && (
              <>
                <span className="text-ns-border">·</span>

                <div className="flex min-w-0 items-center gap-1 overflow-hidden">
                  {folder.tags.slice(0, 3).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectTag?.(tag)
                      }}
                      className="max-w-[80px] shrink-0 truncate rounded-md border border-purple-500/20 bg-purple-500/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-purple-300 transition-colors hover:border-purple-500/50 hover:bg-purple-500/15 hover:text-white"
                      title={`Filter by #${tag}`}
                    >
                      #{tag}
                    </button>
                  ))}

                  {folder.tags.length > 3 && (
                    <span className="shrink-0 text-[9px] font-medium text-ns-faint">
                      +{folder.tags.length - 3}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mt-2.5 flex items-center justify-between border-t border-ns-border-soft/50 pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onSelect?.(folder)
              }}
              className="flex items-center gap-1 text-[10px] font-semibold text-ns-primary-lt transition-colors hover:text-white"
            >
              <span>Open folder</span>
              <ArrowRight
                size={11}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>

            <div className="flex gap-1 text-ns-ghost">
              <Button
                onClick={handleEdit}
                title="Edit Folder"
                size={'icon-sm'}
                className="bg-ns-primary/30"
              >
                <Pencil />
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete Folder"
                size={'icon-sm'}
                className="bg-ns-primary/30"
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </GlowCard>
  )
}

export const FolderCard = React.memo(FolderCardComponent)
