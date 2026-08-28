import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Layers, Pencil, Trash2, Clock, ArrowRight } from 'lucide-react'
import { PixelCard } from '@/shared/ui/system/pixel-card'
import type { WorkspaceItemRecord } from './workspace-modal'
import { Button } from '@/shared/ui/core/button'

interface WorkspaceCardProps {
  workspaceItem: WorkspaceItemRecord
  onSelect?: (item: WorkspaceItemRecord) => void
  onEdit?: (item: WorkspaceItemRecord) => void
  onDelete?: (item: WorkspaceItemRecord) => void
  isDeleting?: boolean
}

function WorkspaceCardComponent({
  workspaceItem,
  onSelect,
  onEdit,
  onDelete,
  isDeleting = false,
}: WorkspaceCardProps) {
  const navigate = useNavigate()

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(workspaceItem)
    } else {
      void navigate({
        to: '/workspace/folder',
        search: { workspaceId: workspaceItem.id },
      })
    }
  }

  const formattedDate = workspaceItem.createdAt
    ? new Date(workspaceItem.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently'

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(workspaceItem)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(workspaceItem)
  }

  const accentColor = workspaceItem.color ?? '#3b82f6'
  const pixelColors = `${accentColor},${accentColor}cc,${accentColor}88,#ffffff`

  return (
    <PixelCard
      colors={pixelColors}
      gap={6}
      speed={35}
      className="group relative flex h-full flex-col justify-between overflow-hidden border-ns-border/50 bg-gray-100 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ns-border-em hover:shadow-2xl hover:shadow-black/40 dark:bg-primary/10"
    >
      <div
        onClick={handleCardClick}
        className="flex h-full flex-1 cursor-pointer flex-col justify-between"
      >
        <div>
          <div className="flex items-start justify-between gap-3">
            <div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border border-ns-border shadow-inner transition-transform duration-300 group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)`,
              }}
            >
              <Layers
                size={22}
                style={{ color: accentColor }}
                className="drop-shadow-sm"
              />
            </div>

            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ml-1 flex items-center gap-0.5 text-ns-ghost">
                <Button
                  type="button"
                  onClick={handleEdit}
                  size={'icon-sm'}
                  title="Edit Workspace"
                  className="bg-ns-primary/10 text-ns-primary-lt hover:bg-ns-primary/20"
                >
                  <Pencil size={13} />
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  size={'icon-sm'}
                  title="Delete Workspace"
                  variant="destructive"
                  className="border-destructive/30 bg-destructive/10 text-destructive hover:border-destructive/50 hover:bg-destructive/20 hover:text-destructive/90"
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="line-clamp-1 text-lg font-bold text-gray-700 uppercase transition-colors group-hover:text-ns-primary-lt dark:text-white">
              {workspaceItem.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed font-normal text-gray-500 dark:text-ns-muted">
              {workspaceItem.description || 'No description provided.'}
            </p>

            {workspaceItem.tags && workspaceItem.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {workspaceItem.tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-0.5 rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-mono text-[0.65rem] font-medium text-purple-300"
                  >
                    <span>#</span>
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-ns-border-soft/60 pt-3 text-[0.7rem] text-ns-faint">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-ns-muted">
            <Clock size={12} className="flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>

          <span className="flex items-center gap-1 text-sm font-semibold text-ns-primary-lt uppercase transition-colors">
            <span>Open</span>
            <ArrowRight
              size={12}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </PixelCard>
  )
}

export const WorkspaceCard = React.memo(WorkspaceCardComponent)
