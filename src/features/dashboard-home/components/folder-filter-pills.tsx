import { Folder, FolderOpen, Filter, Layers, X } from 'lucide-react'
import { FOLDERS } from '@/shared/mocks/mock-data'

interface FolderFilterPillsProps {
  nodes: { folderId?: string }[]
  selectedFolderId: string | null
  onSelectFolder: (id: string | null) => void
}

export function FolderFilterPills({
  nodes,
  selectedFolderId,
  onSelectFolder,
}: FolderFilterPillsProps) {
  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
      {/* Label */}
      <div className="flex flex-shrink-0 items-center gap-1.5 border-r border-ns-border-soft pr-2">
        <Filter size={11} className="text-ns-ghost" />
        <span className="text-sm font-bold tracking-wider text-ns-muted uppercase">
          TAGS:
        </span>
      </div>

      {/* "All Folders" Pill */}
      <button
        onClick={() => onSelectFolder(null)}
        className={`flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 py-1 text-sm font-medium transition-all ${
          selectedFolderId === null
            ? 'border-ns-primary/50 bg-ns-primary/15 text-ns-primary-lt shadow-sm'
            : 'border-ns-border-soft bg-ns-panel/60 text-ns-ghost hover:border-ns-border hover:text-ns-text-2'
        }`}
      >
        <Layers size={11} />
        <span>All ( {nodes.length} )</span>
      </button>

      {/* Folder Chips */}
      {FOLDERS.map((f) => {
        const isSelected = selectedFolderId === f.id
        const count = nodes.filter((n) => n.folderId === f.id).length
        return (
          <button
            key={f.id}
            onClick={() => onSelectFolder(isSelected ? null : f.id)}
            className={`flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 py-1 text-sm font-medium transition-all ${
              isSelected
                ? 'border-ns-border-em bg-ns-active/80 text-ns-primary-lt shadow-sm'
                : 'border-white/10 bg-ns-panel/40 text-ns-muted hover:border-ns-border hover:bg-ns-hover/40 hover:text-ns-text'
            }`}
          >
            {isSelected ? (
              <FolderOpen size={11} style={{ color: f.color ?? '#a78bfa' }} />
            ) : (
              <Folder size={11} style={{ color: f.color ?? '#94a3b8' }} />
            )}
            <span>{f.name}</span>
            <span className="py-0.2 rounded-full bg-ns-border-soft/60 px-1.5 text-[0.55rem] font-bold text-ns-faint">
              {count}
            </span>
          </button>
        )
      })}

      {/* Clear Filter */}
      {selectedFolderId && (
        <button
          onClick={() => onSelectFolder(null)}
          className="flex flex-shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-[0.62rem] font-bold text-red-400 hover:bg-red-500/20"
          title="Clear folder filter"
        >
          <X size={10} />
          <span>Clear Filter</span>
        </button>
      )}
    </div>
  )
}
