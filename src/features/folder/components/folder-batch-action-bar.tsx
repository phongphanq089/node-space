import { CheckCircle2, Trash2 } from 'lucide-react'

export interface FolderBatchActionBarProps {
  isSelectMode: boolean
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
  onDeselectAll: () => void
  onDeleteSelected: () => void
  onCancel: () => void
}

export function FolderBatchActionBar({
  isSelectMode,
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  onCancel,
}: FolderBatchActionBarProps) {
  if (!isSelectMode) return null

  const isAllSelected = selectedCount > 0 && selectedCount === totalCount

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 animate-in items-center gap-3 rounded-2xl border border-white/20 bg-[#121118]/95 px-5 py-3 shadow-2xl backdrop-blur-xl slide-in-from-bottom-5 fade-in">
      {/* Selected Count */}
      <div className="flex items-center gap-2 border-r border-white/15 pr-3 text-xs font-bold text-white">
        <CheckCircle2 size={16} className="text-ns-primary-lt" />
        <span>
          {selectedCount} / {totalCount} selected
        </span>
      </div>

      {/* Select / Deselect All */}
      <button
        type="button"
        onClick={isAllSelected ? onDeselectAll : onSelectAll}
        className="cursor-pointer text-xs font-semibold text-zinc-300 transition-colors hover:text-white"
      >
        {isAllSelected ? 'Deselect All' : 'Select All'}
      </button>

      {/* Delete Selected Button */}
      <button
        type="button"
        disabled={selectedCount === 0}
        onClick={onDeleteSelected}
        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-red-600/85 px-3.5 py-1.5 text-xs font-bold text-white shadow-md transition-all hover:bg-red-600 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
      >
        <Trash2 size={13} />
        <span>Delete ({selectedCount})</span>
      </button>

      {/* Cancel Action */}
      <button
        type="button"
        onClick={onCancel}
        className="cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
      >
        Cancel
      </button>
    </div>
  )
}
