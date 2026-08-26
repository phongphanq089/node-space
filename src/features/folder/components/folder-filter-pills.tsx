import { useState, useMemo } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/core/dropdown-menu'
import { Layers, ChevronDown, Check, Search, X, RotateCcw } from 'lucide-react'
import { useWorkspacesQuery } from '@/features/workspace/hooks/use-workspaces'
import { Skeleton } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

export interface FolderFilterPillsProps {
  workspaces?: readonly { id: string; name: string; color?: string | null }[]
  selectedWorkspaceId: string | null
  onSelectWorkspace: (id: string | null) => void
  className?: string
}

export function FolderFilterPills({
  workspaces,
  selectedWorkspaceId,
  onSelectWorkspace,
  className,
}: FolderFilterPillsProps) {
  const { data: dbWorkspaces = [], isLoading } = useWorkspacesQuery()
  const [wsSearch, setWsSearch] = useState('')

  const displayWorkspaces = workspaces ?? dbWorkspaces

  const selectedWs = useMemo(() => {
    if (!selectedWorkspaceId) return null
    return displayWorkspaces.find(
      (ws) => ws.id === selectedWorkspaceId || ws.name === selectedWorkspaceId
    )
  }, [displayWorkspaces, selectedWorkspaceId])

  const filteredWorkspaces = useMemo(() => {
    if (!wsSearch.trim()) return displayWorkspaces
    const query = wsSearch.toLowerCase()
    return displayWorkspaces.filter((ws) =>
      ws.name.toLowerCase().includes(query)
    )
  }, [displayWorkspaces, wsSearch])

  return (
    <div className="flex flex-shrink-0 items-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex h-9 flex-shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-3 text-xs font-semibold whitespace-nowrap shadow-xs transition-all active:scale-95',
              selectedWs
                ? 'border-ns-primary/50 bg-ns-primary/15 text-ns-primary shadow-xs dark:border-ns-border-em dark:bg-ns-active/80 dark:text-ns-primary-lt'
                : 'border-ns-border/70 bg-ns-surface text-ns-text hover:border-ns-border-em hover:bg-ns-hover dark:bg-ns-panel dark:hover:text-white',
              className
            )}
          >
            {selectedWs ? (
              <>
                <span
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: selectedWs.color ?? '#3b82f6' }}
                />
                <span className="text-ns-muted">Workspace:</span>
                <span className="max-w-32 truncate font-bold text-ns-text dark:text-white">
                  {selectedWs.name}
                </span>
              </>
            ) : (
              <>
                <Layers size={13} className="flex-shrink-0 text-ns-primary" />
                <span>
                  Workspaces:{' '}
                  <span className="font-bold text-ns-text dark:text-white">
                    All ({displayWorkspaces.length})
                  </span>
                </span>
              </>
            )}
            <ChevronDown size={12} className="flex-shrink-0 text-ns-muted" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-64 rounded-2xl border border-ns-border-soft bg-ns-surface/95 p-1.5 text-ns-text shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#121118]/95 dark:text-white"
        >
          <div className="flex items-center justify-between px-2 py-1">
            <DropdownMenuLabel className="p-0 text-[0.7rem] font-bold tracking-wider text-ns-muted uppercase dark:text-zinc-400">
              Filter by Workspace ({displayWorkspaces.length})
            </DropdownMenuLabel>
            {selectedWorkspaceId && (
              <button
                type="button"
                onClick={() => onSelectWorkspace(null)}
                className="flex cursor-pointer items-center gap-1 text-[0.68rem] font-bold text-ns-primary hover:underline dark:text-ns-primary-lt"
              >
                <RotateCcw size={10} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {displayWorkspaces.length > 4 && (
            <div className="relative px-1 py-1">
              <Search
                size={13}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-ns-muted dark:text-zinc-400"
              />
              <input
                type="text"
                value={wsSearch}
                onChange={(e) => setWsSearch(e.target.value)}
                placeholder="Search workspaces..."
                className="h-8 w-full rounded-lg border border-ns-border-soft bg-ns-surface-alt pr-2 pl-8 text-xs text-ns-text outline-none placeholder:text-ns-muted focus:border-ns-primary/50 focus:bg-ns-surface dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-500 dark:focus:bg-white/10"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <DropdownMenuSeparator className="my-1 bg-ns-border-soft dark:bg-white/10" />

          {/* All Workspaces Option */}
          <DropdownMenuItem
            onClick={() => onSelectWorkspace(null)}
            className={cn(
              'flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors',
              selectedWorkspaceId === null
                ? 'bg-ns-primary/10 font-bold text-ns-primary dark:bg-white/10 dark:text-white'
                : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white'
            )}
          >
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-ns-primary" />
              <span>All Workspaces</span>
            </div>
            {selectedWorkspaceId === null ? (
              <Check
                size={14}
                className="flex-shrink-0 text-ns-primary dark:text-white"
                strokeWidth={2.5}
              />
            ) : (
              <span className="rounded-full bg-ns-surface-alt px-1.5 py-0.5 text-[10px] font-bold text-ns-muted dark:bg-white/10">
                {displayWorkspaces.length}
              </span>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 bg-ns-border-soft dark:bg-white/10" />

          {/* Workspaces List */}
          <div className="no-scrollbar max-h-52 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-1 p-1">
                <Skeleton className="h-7 w-full rounded-lg" />
                <Skeleton className="h-7 w-full rounded-lg" />
                <Skeleton className="h-7 w-full rounded-lg" />
              </div>
            ) : filteredWorkspaces.length === 0 ? (
              <div className="py-3 text-center text-xs text-ns-muted dark:text-zinc-500">
                No workspaces found
              </div>
            ) : (
              filteredWorkspaces.map((ws) => {
                const isSelected =
                  selectedWorkspaceId === ws.id ||
                  selectedWorkspaceId === ws.name
                return (
                  <DropdownMenuItem
                    key={ws.id || ws.name}
                    onClick={() => onSelectWorkspace(isSelected ? null : ws.id)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors',
                      isSelected
                        ? 'bg-ns-primary/10 font-bold text-ns-primary dark:bg-white/10 dark:text-white'
                        : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: ws.color ?? '#3b82f6' }}
                      />
                      <span className="truncate">{ws.name}</span>
                    </div>
                    {isSelected && (
                      <Check
                        size={14}
                        className="flex-shrink-0 text-ns-primary dark:text-white"
                        strokeWidth={2.5}
                      />
                    )}
                  </DropdownMenuItem>
                )
              })
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Quick Clear Button */}
      {selectedWorkspaceId && (
        <button
          type="button"
          onClick={() => onSelectWorkspace(null)}
          className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-xl border border-ns-primary/30 bg-ns-primary/10 text-ns-primary transition-colors hover:bg-ns-primary/20 dark:text-ns-primary-lt dark:hover:text-white"
          title="Clear workspace filter"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}
