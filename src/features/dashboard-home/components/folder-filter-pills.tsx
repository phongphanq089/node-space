import { Layers, Filter, X } from 'lucide-react'
import { useWorkspacesQuery } from '../hooks/use-workspaces'

interface FolderFilterPillsProps {
  workspaces?: readonly { id: string; name: string; color?: string | null }[]
  selectedWorkspaceId: string | null
  onSelectWorkspace: (id: string | null) => void
}

export function FolderFilterPills({
  workspaces,
  selectedWorkspaceId,
  onSelectWorkspace,
}: FolderFilterPillsProps) {
  const { data: dbWorkspaces = [] } = useWorkspacesQuery()
  const displayWorkspaces = workspaces ?? dbWorkspaces

  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
      {/* Label */}
      <div className="flex flex-shrink-0 items-center gap-1.5 border-r border-ns-border-soft pr-2">
        <Filter size={11} className="text-ns-ghost" />
        <span className="text-xs font-bold tracking-wider text-ns-muted uppercase">
          WORKSPACES:
        </span>
      </div>

      {/* "All Workspaces" Pill */}
      <button
        onClick={() => onSelectWorkspace(null)}
        className={`flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 py-1 text-sm font-medium transition-all ${
          selectedWorkspaceId === null
            ? 'border-ns-primary/50 bg-ns-primary/15 text-ns-primary-lt shadow-sm'
            : 'border-ns-border-soft bg-ns-panel/60 text-ns-ghost hover:border-ns-border hover:text-ns-text-2'
        }`}
      >
        <Layers size={11} />
        <span>All ({displayWorkspaces.length})</span>
      </button>

      {/* Workspace Chips */}
      {displayWorkspaces.map((ws) => {
        const isSelected =
          selectedWorkspaceId === ws.id || selectedWorkspaceId === ws.name
        return (
          <button
            key={ws.id}
            onClick={() => onSelectWorkspace(isSelected ? null : ws.id)}
            className={`flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 py-1 text-sm font-medium transition-all ${
              isSelected
                ? 'border-ns-border-em bg-ns-active/80 text-ns-primary-lt shadow-sm'
                : 'border-white/10 bg-ns-panel/40 text-ns-muted hover:border-ns-border hover:bg-ns-hover/40 hover:text-ns-text'
            }`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: ws.color ?? '#3b82f6' }}
            />
            <span>{ws.name}</span>
          </button>
        )
      })}

      {/* Clear Filter */}
      {selectedWorkspaceId && (
        <button
          onClick={() => onSelectWorkspace(null)}
          className="flex flex-shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-[0.62rem] font-bold text-red-400 hover:bg-red-500/20"
          title="Clear workspace filter"
        >
          <X size={10} />
          <span>Clear Filter</span>
        </button>
      )}
    </div>
  )
}
