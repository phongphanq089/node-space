import * as React from 'react'
import { Layers, ChevronDown } from 'lucide-react'
import { CommandGroup, CommandItem, CommandSeparator } from '@/shared/ui'

export interface WorkspaceRecord {
  id: string
  name: string
  color?: string | null
  description?: string | null
  tags?: string[]
}

const DEFAULT_LIMIT = 4

interface WorkspacesGroupProps {
  workspaces: WorkspaceRecord[]
  hasSeparatorAbove?: boolean
  onSelect: (ws: WorkspaceRecord) => void
}

export function WorkspacesGroup({
  workspaces,
  hasSeparatorAbove = false,
  onSelect,
}: WorkspacesGroupProps) {
  const [limit, setLimit] = React.useState(DEFAULT_LIMIT)
  const visible = workspaces.slice(0, limit)
  const hasMore = workspaces.length > limit

  if (workspaces.length === 0) return null

  return (
    <>
      {hasSeparatorAbove && <CommandSeparator />}
      <CommandGroup heading="Workspaces">
        {visible.map((ws) => {
          const accentColor = ws.color || '#8b5cf6'
          return (
            <CommandItem
              key={ws.id || ws.name}
              onSelect={() => onSelect(ws)}
              className="group flex items-center justify-between rounded-xl px-3 py-2.5 data-[selected=true]:bg-accent dark:data-[selected=true]:bg-ns-hover/60"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 shadow-xs transition-transform group-hover:scale-105 dark:border-ns-border-soft dark:bg-ns-bg/60"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}33)`,
                  }}
                >
                  <Layers
                    size={16}
                    style={{ color: accentColor }}
                    className="drop-shadow-xs"
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-semibold text-foreground group-data-[selected=true]:text-accent-foreground dark:text-ns-text dark:group-data-[selected=true]:text-white">
                      {ws.name}
                    </span>
                    <span
                      className="size-2 shrink-0 rounded-full border border-white/20 shadow-xs"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>
                  {ws.description ? (
                    <span className="truncate text-[0.68rem] text-muted-foreground dark:text-ns-muted">
                      {ws.description}
                    </span>
                  ) : ws.tags && ws.tags.length > 0 ? (
                    <span className="truncate text-[0.68rem] text-muted-foreground dark:text-ns-muted">
                      {ws.tags.map((t) => `#${t}`).join(' ')}
                    </span>
                  ) : (
                    <span className="text-[0.68rem] text-muted-foreground dark:text-ns-muted">
                      Workspace
                    </span>
                  )}
                </div>
              </div>

              {ws.tags && ws.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  {ws.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-purple-500/20 bg-purple-500/10 px-1.5 py-0.5 font-mono text-[0.625rem] text-purple-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </CommandItem>
          )
        })}

        {hasMore && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLimit((prev) => prev + DEFAULT_LIMIT)
            }}
            className="mt-0.5 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.7rem] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground dark:text-ns-ghost dark:hover:bg-ns-hover dark:hover:text-ns-text"
          >
            <ChevronDown className="size-3.5" />
            Show {Math.min(DEFAULT_LIMIT, workspaces.length - limit)} more
            workspaces
          </button>
        )}
      </CommandGroup>
    </>
  )
}
