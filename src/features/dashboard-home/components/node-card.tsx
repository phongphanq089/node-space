import { Star, Trash2, FileText, Clock, ArrowRight, Folder } from 'lucide-react'
import { GlowCard } from '@/shared/ui/system/glow-card-grid'
import {
  useDeleteFolderMutation,
  useToggleFavoriteFolderMutation,
} from '../hooks/use-folders'
import type { NODES } from '@/shared/mocks/mock-data'

type NodeWithThumbnail = (typeof NODES)[number] & { thumbnail?: string }

interface NodeCardProps {
  node: NodeWithThumbnail
  onSelect?: (node: NodeWithThumbnail) => void
  onToggleStar?: (e: React.MouseEvent, title: string) => void
}

export interface FolderItemRecord {
  id: string
  name: string
  color?: string | null
  image?: string | null
  isFavorite?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
}

interface FolderCardProps {
  folder: FolderItemRecord
  onSelect?: (folder: FolderItemRecord) => void
}

export function FolderCard({ folder, onSelect }: FolderCardProps) {
  const deleteMutation = useDeleteFolderMutation()
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
    if (confirm(`Are you sure you want to delete folder "${folder.name}"?`)) {
      deleteMutation.mutate(folder.id)
    }
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    favoriteMutation.mutate(folder.id)
  }

  return (
    <GlowCard avatar={folder.image || undefined} className="cursor-pointer">
      <div
        onClick={() => onSelect?.(folder)}
        className="group flex items-stretch gap-4 p-4"
      >
        {/* Left: Thumbnail or Color Accent Box */}
        {folder.image ? (
          <img
            src={folder.image}
            alt={folder.name}
            className="h-24 w-24 flex-shrink-0 rounded-2xl border border-ns-border object-cover shadow-sm transition-all group-hover:border-ns-border-md"
          />
        ) : (
          <div
            className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl border border-ns-border shadow-inner transition-all group-hover:border-ns-border-md"
            style={{
              background: `linear-gradient(135deg, ${
                folder.color ?? '#3b82f6'
              }22, ${folder.color ?? '#3b82f6'}44)`,
            }}
          >
            <Folder
              size={32}
              style={{ color: folder.color ?? '#60a5fa' }}
              className="drop-shadow-md"
            />
          </div>
        )}

        {/* Right: Info Area */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          {/* Row 1: Title & Star */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-bold text-white transition-colors group-hover:text-ns-primary-lt">
              {folder.name}
            </h3>
            <button
              onClick={handleToggleFavorite}
              disabled={favoriteMutation.isPending}
              className="flex-shrink-0 cursor-pointer rounded p-1 text-ns-ghost transition-all hover:bg-ns-hover/80 hover:text-amber-400"
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

          {/* Row 2: Creation / Updated Date */}
          <div className="mt-1 flex items-center gap-1.5 text-[0.68rem] text-ns-faint">
            <Clock size={11} className="flex-shrink-0" />
            <span>Created {formattedDate}</span>
          </div>

          {/* Row 3: Notes count badge */}
          <div className="mt-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1 rounded border border-ns-border-soft bg-ns-active/40 px-2 py-0.5 text-[0.62rem] font-bold text-ns-muted">
              <FileText size={10} className="text-ns-ghost" />
              <span>Folder</span>
            </span>
          </div>

          {/* Row 4: View Details & Delete action */}
          <div className="mt-3 flex items-center justify-between border-t border-ns-border-soft/60 pt-2.5">
            <span className="group/link flex items-center gap-1.5 text-[0.68rem] font-bold text-ns-primary-lt transition-colors hover:text-white">
              <span>Open folder</span>
              <ArrowRight
                size={11}
                className="transition-transform group-hover/link:translate-x-0.5"
              />
            </span>
            <div className="flex gap-1 text-ns-ghost">
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="cursor-pointer rounded p-1 transition-colors hover:bg-ns-hover hover:text-red-400 disabled:opacity-50"
                title="Delete Folder"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </GlowCard>
  )
}

export function NodeCard({ node, onSelect, onToggleStar }: NodeCardProps) {
  return (
    <GlowCard avatar={node.thumbnail} className="cursor-pointer">
      <div
        onClick={() => onSelect?.(node)}
        className="group flex items-stretch gap-4 p-4"
      >
        {/* Left: Thumbnail */}
        {node.thumbnail ? (
          <img
            src={node.thumbnail}
            alt={node.title}
            className="h-24 w-24 flex-shrink-0 rounded-2xl border border-ns-border object-cover shadow-sm transition-all group-hover:border-ns-border-md"
          />
        ) : (
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl border border-ns-border bg-gradient-to-br from-ns-active to-ns-hover text-lg font-bold text-white transition-all group-hover:border-ns-border-md">
            N
          </div>
        )}

        {/* Right: Info Area */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-bold text-white transition-colors group-hover:text-ns-primary-lt">
              {node.title}
            </h3>
            {onToggleStar && (
              <button
                onClick={(e) => onToggleStar(e, node.title)}
                className="flex-shrink-0 cursor-pointer rounded p-1 text-ns-ghost transition-all hover:bg-ns-hover/80 hover:text-amber-400"
                title={node.starred ? 'Unstar' : 'Star'}
              >
                <Star
                  size={13}
                  fill={node.starred ? '#fbbf24' : 'none'}
                  className={node.starred ? 'text-amber-400' : 'text-ns-ghost'}
                />
              </button>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[0.68rem] text-ns-faint">
            <div className="flex items-center gap-1.5">
              <Clock size={11} className="flex-shrink-0" />
              <span>{node.updated}</span>
            </div>
            {node.folderName && (
              <span className="flex items-center gap-1 rounded border border-ns-border-soft/60 bg-ns-hover/60 px-1.5 py-0.5 text-[0.6rem] font-semibold text-ns-primary-lt">
                <Folder size={10} className="text-ns-primary-lt" />
                {node.folderName}
              </span>
            )}
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1 rounded border border-ns-border-soft bg-ns-active/40 px-2 py-0.5 text-[0.62rem] font-bold text-ns-muted">
              <FileText size={10} className="text-ns-ghost" />
              <span>{node.count} notes</span>
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-ns-border-soft/60 pt-2.5">
            <span className="group/link flex items-center gap-1.5 text-[0.68rem] font-bold text-ns-primary-lt transition-colors hover:text-white">
              <span>View details</span>
              <ArrowRight
                size={11}
                className="transition-transform group-hover/link:translate-x-0.5"
              />
            </span>
          </div>
        </div>
      </div>
    </GlowCard>
  )
}
