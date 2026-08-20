import { Layers, Filter, X } from 'lucide-react'
import { useWorkspacesQuery } from '@/features/workspace/hooks/use-workspaces'
import { Skeleton } from '@/shared/ui'

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
  const { data: dbWorkspaces = [], isLoading } = useWorkspacesQuery()

  const displayWorkspaces = workspaces ?? dbWorkspaces

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2">
      <div className="flex flex-shrink-0 items-center gap-1.5 border-r border-ns-border-soft pr-2 text-ns-primary! uppercase dark:text-white/70">
        <Filter size={11} className="" />
        <span className="text-xs font-bold">WORKSPACES:</span>
      </div>
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
      {isLoading ? (
        <LoadingSkeleton count={15} />
      ) : (
        <>
          {displayWorkspaces.map((ws) => {
            const isSelected =
              selectedWorkspaceId === ws.id || selectedWorkspaceId === ws.name
            return (
              <button
                key={ws.id || ws.name}
                onClick={() => onSelectWorkspace(isSelected ? null : ws.id)}
                className={`flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 py-1 text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-ns-border-em bg-ns-active/80 text-ns-primary-lt shadow-sm'
                    : 'border-gray-200 bg-ns-panel text-ns-muted hover:border-ns-border hover:bg-ns-hover/40 hover:text-ns-text dark:border-white/10'
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
        </>
      )}

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

const LoadingSkeleton = ({ count = 6 }: { count?: number }) => {
  return Array.from({ length: count }).map((_, index) => {
    return (
      <Skeleton
        key={index}
        className="flex h-7 w-14 flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-sm bg-ns-primary/10 px-2.5 py-1 text-sm font-medium transition-all"
      />
    )
  })
}
