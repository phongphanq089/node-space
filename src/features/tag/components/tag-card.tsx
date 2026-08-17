import { Hash, Pencil, Trash2 } from 'lucide-react'
import type { TagRecord } from '../tag.fns'

interface TagCardProps {
  tag: TagRecord
  isSelected: boolean
  onSelect: (tagName: string) => void
  onEdit?: (tag: TagRecord) => void
  onDelete?: (tag: TagRecord) => void
}

export function TagCard({
  tag,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: TagCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(tag)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(tag)
  }

  return (
    <div
      onClick={() => onSelect(tag.name)}
      className={`group relative flex cursor-pointer items-center justify-between rounded-xl border p-3 text-left transition-all duration-200 outline-none ${
        isSelected
          ? 'border-ns-primary bg-ns-primary/20 shadow-lg ring-1 shadow-ns-primary/20 ring-ns-primary/50'
          : 'border-ns-border-soft bg-ns-panel/70 hover:border-ns-border-md hover:bg-ns-panel hover:shadow-lg'
      }`}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/10 shadow-inner"
          style={{ backgroundColor: tag.bg, color: tag.color }}
        >
          <Hash size={14} />
        </div>
        <span
          className={`truncate text-xs font-bold transition-colors ${
            isSelected
              ? 'text-white'
              : 'text-ns-text group-hover:text-ns-primary-lt'
          }`}
        >
          #{tag.name}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className="shrink-0 rounded-md border border-ns-border-soft bg-ns-bg/60 px-2 py-0.5 font-mono text-[0.625rem] font-bold text-ns-muted"
          style={{ color: isSelected ? tag.color : undefined }}
        >
          {tag.count}
        </span>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {onEdit && (
              <button
                type="button"
                onClick={handleEdit}
                className="cursor-pointer rounded p-1 text-ns-muted transition-colors hover:bg-ns-hover hover:text-white"
                title="Edit Tag"
              >
                <Pencil size={11} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="cursor-pointer rounded p-1 text-ns-muted transition-colors hover:bg-ns-hover hover:text-red-400"
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
