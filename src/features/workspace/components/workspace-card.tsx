import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Layers, Pencil, Trash2, Clock, ArrowRight } from 'lucide-react'
import { PixelCard } from '@/shared/ui/system/pixel-card'
import type { WorkspaceItemRecord } from './workspace-modal'

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
      className="group relative flex h-full flex-col justify-between overflow-hidden border-ns-border/80 bg-ns-panel/90 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ns-border-em hover:shadow-2xl hover:shadow-black/40"
    >
      <div
        onClick={handleCardClick}
        className="flex h-full flex-1 cursor-pointer flex-col justify-between"
      >
        {/* Top Section: Icon & Actions */}
        <div>
          <div className="flex items-start justify-between gap-3">
            {/* Icon Box with Accent Gradient */}
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-ns-border shadow-inner transition-transform duration-300 group-hover:scale-105"
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

            {/* Top Right: Accent Color Indicator + Edit/Delete Buttons */}
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: accentColor }}
                title={`Accent Color: ${accentColor}`}
              />
              <div className="ml-1 flex items-center gap-0.5 text-ns-ghost">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-ns-hover hover:text-ns-primary-lt"
                  title="Edit Workspace"
                >
                  <Pencil size={13} />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-ns-hover hover:text-red-400 disabled:opacity-50"
                  title="Delete Workspace"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Middle Section: Title, Description & Tags */}
          <div className="mt-4">
            <h3 className="line-clamp-1 text-base font-bold text-white transition-colors group-hover:text-ns-primary-lt">
              {workspaceItem.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed font-normal text-ns-muted">
              {workspaceItem.description || 'No description provided.'}
            </p>

            {/* Topic Tags */}
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

        {/* Bottom Section: Date & View Action */}
        <div className="mt-5 flex items-center justify-between border-t border-ns-border-soft/60 pt-3 text-[0.7rem] text-ns-faint">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>

          <span className="flex items-center gap-1 font-semibold text-ns-primary-lt transition-colors group-hover:text-white">
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
