import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Layers, Pencil, Trash2, Clock, ArrowRight } from 'lucide-react'
import { GlowCard } from '@/shared/ui/system/glow-card-grid'
import { ConfirmDeleteModal } from '@/shared/ui/system'
import { useDeleteWorkspaceMutation } from '../hooks/use-workspaces'
import { EditWorkspaceModal } from './edit-workspace-modal'
import type { WorkspaceItemRecord } from './edit-workspace-modal'

interface WorkspaceCardProps {
  workspaceItem: WorkspaceItemRecord
  onSelect?: (item: WorkspaceItemRecord) => void
}

export function WorkspaceCard({ workspaceItem, onSelect }: WorkspaceCardProps) {
  const navigate = useNavigate()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const deleteMutation = useDeleteWorkspaceMutation()

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
    setIsDeleteModalOpen(true)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditModalOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteMutation.mutate(workspaceItem.id, {
      onSuccess: () => setIsDeleteModalOpen(false),
    })
  }

  return (
    <>
      <GlowCard className="cursor-pointer">
        <div
          onClick={handleCardClick}
          className="group flex items-stretch gap-4 p-4"
        >
          {/* Left: Color Accent Icon Box */}
          <div
            className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-ns-border shadow-inner transition-all group-hover:border-ns-border-md"
            style={{
              background: `linear-gradient(135deg, ${
                workspaceItem.color ?? '#3b82f6'
              }22, ${workspaceItem.color ?? '#3b82f6'}44)`,
            }}
          >
            <Layers
              size={28}
              style={{ color: workspaceItem.color ?? '#60a5fa' }}
              className="drop-shadow-md"
            />
          </div>

          {/* Right: Info Area */}
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            {/* Row 1: Title & Color indicator */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-ns-primary-lt">
                {workspaceItem.name}
              </h3>
              <span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: workspaceItem.color ?? '#3b82f6' }}
              />
            </div>

            {/* Row 2: Description */}
            <p className="line-clamp-2 text-xs font-normal text-ns-muted">
              {workspaceItem.description || 'No description provided.'}
            </p>

            {/* Row 3: Creation Date */}
            <div className="mt-1 flex items-center gap-1.5 text-[0.68rem] text-ns-faint">
              <Clock size={11} className="flex-shrink-0" />
              <span>Created {formattedDate}</span>
            </div>

            {/* Topic Tags */}
            {workspaceItem.tags && workspaceItem.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {workspaceItem.tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-0.5 rounded border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 font-mono text-[0.6rem] font-bold text-purple-300"
                  >
                    <span>#</span>
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Row 4: Actions */}
            <div className="mt-3 flex items-center justify-between border-t border-ns-border-soft/60 pt-2.5">
              <span className="group/link flex items-center gap-1.5 text-[0.68rem] font-bold text-ns-primary-lt transition-colors hover:text-white">
                <span>View workspace</span>
                <ArrowRight
                  size={11}
                  className="transition-transform group-hover/link:translate-x-0.5"
                />
              </span>
              <div className="flex gap-1 text-ns-ghost">
                <button
                  onClick={handleEdit}
                  className="cursor-pointer rounded p-1 transition-colors hover:bg-ns-hover hover:text-ns-primary-lt"
                  title="Edit Workspace"
                >
                  <Pencil size={11} />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="cursor-pointer rounded p-1 transition-colors hover:bg-ns-hover hover:text-red-400 disabled:opacity-50"
                  title="Delete Workspace"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* Edit Workspace Modal */}
      <EditWorkspaceModal
        workspaceItem={workspaceItem}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Workspace"
        description="Are you sure you want to delete this workspace? This action cannot be undone."
        itemName={workspaceItem.name}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
