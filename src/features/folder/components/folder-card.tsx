import { useState } from 'react'
import {
  Star,
  Trash2,
  FileText,
  Clock,
  ArrowRight,
  Folder,
  Pencil,
} from 'lucide-react'
import { GlowCard } from '@/shared/ui/system/glow-card-grid'
import { ConfirmDeleteModal } from '@/shared/ui/system'
import { FolderModal } from './folder-modal'
import {
  useDeleteFolderMutation,
  useToggleFavoriteFolderMutation,
} from '../hooks/use-folders'

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
}

export function FolderCard({ folder, onSelect, onSelectTag }: FolderCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
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
    setIsDeleteModalOpen(true)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditModalOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteMutation.mutate(folder.id, {
      onSuccess: () => setIsDeleteModalOpen(false),
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    favoriteMutation.mutate(folder.id)
  }

  return (
    <>
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
                  folder.isFavorite
                    ? 'Remove from favorites'
                    : 'Add to favorites'
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

            <div className="mt-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1 rounded border border-ns-border-soft bg-ns-active/40 px-2 py-0.5 text-[0.62rem] font-bold text-ns-muted">
                <FileText size={10} className="text-ns-ghost" />
                <span>Folder</span>
              </span>

              {folder.tags && folder.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {folder.tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectTag?.(t)
                      }}
                      className="flex cursor-pointer items-center gap-0.5 rounded border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 font-mono text-[0.6rem] font-bold text-purple-300 transition-all hover:border-purple-500/60 hover:bg-purple-500/20 hover:text-white"
                      title={`Filter by #${t}`}
                    >
                      <span>#</span>
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Row 4: View Details & Actions */}
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
                  onClick={handleEdit}
                  className="cursor-pointer rounded p-1 transition-colors hover:bg-ns-hover hover:text-ns-primary-lt"
                  title="Edit Folder"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="cursor-pointer rounded p-1 transition-colors hover:bg-ns-hover hover:text-red-400 disabled:opacity-50"
                  title="Delete Folder"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* Edit Folder Modal */}
      <FolderModal
        mode="edit"
        folder={folder}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Folder"
        description="Are you sure you want to delete this folder? This action cannot be undone."
        itemName={folder.name}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
