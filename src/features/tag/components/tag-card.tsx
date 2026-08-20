import React from 'react'
import { Hash, Pencil, Trash2 } from 'lucide-react'
import type { TagRecord } from '../tag.fns'
import { cn } from '@/shared/lib/utils'

interface TagCardProps {
  tag: TagRecord
  isSelected: boolean
  onSelect: (tagName: string) => void
  onEdit?: (tag: TagRecord) => void
  onDelete?: (tag: TagRecord) => void
  viewMode?: 'grid' | 'cloud' | 'list'
}

export function TagCard({
  tag,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  viewMode = 'grid',
}: TagCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(tag)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(tag)
  }

  const tagColor = tag.color || '#8b5cf6'
  const tagBg = tag.bg || `${tagColor}15`

  if (viewMode === 'cloud') {
    return (
      <button
        type="button"
        onClick={() => onSelect(tag.name)}
        className={cn(
          'group inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 shadow-xs transition-all duration-200',
          isSelected
            ? 'border-ns-primary bg-ns-primary text-white shadow-md ring-2 ring-ns-primary/30'
            : 'border-ns-border-soft bg-ns-surface text-ns-text hover:border-ns-border-md hover:bg-ns-hover'
        )}
      >
        <span
          className={cn(
            'flex size-5 items-center justify-center rounded-md font-mono text-[10px] font-bold',
            isSelected ? 'bg-white/20 text-white' : 'text-ns-primary'
          )}
          style={
            !isSelected
              ? { backgroundColor: tagBg, color: tagColor }
              : undefined
          }
        >
          #
        </span>
        <span className="text-xs font-bold">{tag.name}</span>
        <span
          className={cn(
            'py-0.2 rounded-full px-1.5 font-mono text-[10px] font-semibold',
            isSelected
              ? 'bg-white/20 text-white'
              : 'bg-ns-surface-alt text-ns-muted'
          )}
        >
          {tag.count}
        </span>
      </button>
    )
  }

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onSelect(tag.name)}
        className={cn(
          'group relative flex cursor-pointer items-center justify-between rounded-xl border p-3 text-left shadow-xs transition-all duration-200',
          isSelected
            ? 'border-ns-primary bg-ns-primary/10 shadow-md ring-1 ring-ns-primary/40'
            : 'border-ns-border-soft bg-ns-surface hover:border-ns-border-md hover:bg-ns-hover'
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-lg shadow-inner"
            style={{ backgroundColor: tagBg, color: tagColor }}
          >
            <Hash size={15} />
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={cn(
                'truncate text-sm font-bold transition-colors',
                isSelected
                  ? 'font-black text-ns-primary'
                  : 'text-ns-text group-hover:text-ns-primary'
              )}
            >
              #{tag.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-ns-surface-alt px-2.5 py-0.5 font-mono text-xs font-semibold text-ns-muted">
            {tag.count} {tag.count === 1 ? 'item' : 'items'}
          </span>

          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {onEdit && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="cursor-pointer rounded-lg p-1.5 text-ns-muted hover:bg-ns-hover hover:text-ns-text"
                  title="Edit Tag"
                >
                  <Pencil size={13} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="cursor-pointer rounded-lg p-1.5 text-ns-muted hover:bg-red-500/10 hover:text-red-500"
                  title="Delete Tag"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default Grid Card
  return (
    <div
      onClick={() => onSelect(tag.name)}
      className={cn(
        'group relative flex cursor-pointer items-center justify-between rounded-xl border p-3 text-left shadow-xs transition-all duration-200 outline-none',
        isSelected
          ? 'border-ns-primary bg-ns-primary/10 shadow-md ring-1 ring-ns-primary/40'
          : 'border-ns-border-soft bg-ns-surface hover:border-ns-border-md hover:bg-ns-hover hover:shadow-md'
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className="flex size-7 shrink-0 items-center justify-center rounded-lg shadow-inner"
          style={{ backgroundColor: tagBg, color: tagColor }}
        >
          <Hash size={14} />
        </div>
        <span
          className={cn(
            'truncate text-xs font-bold transition-colors',
            isSelected
              ? 'font-black text-ns-primary'
              : 'text-ns-text group-hover:text-ns-primary'
          )}
        >
          #{tag.name}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="shrink-0 rounded-md border border-ns-border-soft bg-ns-surface-alt px-2 py-0.5 font-mono text-[0.625rem] font-bold text-ns-muted">
          {tag.count}
        </span>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            {onEdit && (
              <button
                type="button"
                onClick={handleEdit}
                className="cursor-pointer rounded p-1 text-ns-muted transition-colors hover:bg-ns-hover hover:text-ns-text"
                title="Edit Tag"
              >
                <Pencil size={11} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="cursor-pointer rounded p-1 text-ns-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                title="Delete Tag"
              >
                <Trash2 size={11} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
