import * as React from 'react'
import { Folder, ChevronDown } from 'lucide-react'
import { CommandGroup, CommandItem, CommandSeparator } from '@/shared/ui'

interface FolderRecord {
  id: string
  name: string
  color?: string | null
  count?: number
}

const DEFAULT_LIMIT = 4

interface FoldersGroupProps {
  folders: FolderRecord[]
  hasSeparatorAbove?: boolean
  onSelect: (folder: FolderRecord) => void
}

export function FoldersGroup({
  folders,
  hasSeparatorAbove = false,
  onSelect,
}: FoldersGroupProps) {
  const [limit, setLimit] = React.useState(DEFAULT_LIMIT)
  const visible = folders.slice(0, limit)
  const hasMore = folders.length > limit

  if (folders.length === 0) return null

  return (
    <>
      {hasSeparatorAbove && <CommandSeparator />}
      <CommandGroup heading="Folders">
        {visible.map((folder) => (
          <CommandItem
            key={folder.id}
            onSelect={() => onSelect(folder)}
            className="group flex items-center justify-between rounded-xl px-3 py-2.5 data-[selected=true]:bg-accent dark:data-[selected=true]:bg-ns-hover/60"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 dark:border-ns-border-soft dark:bg-ns-bg/60"
                style={{ color: folder.color || '#a78bfa' }}
              >
                <Folder className="size-4" />
              </div>
              <span className="text-xs font-semibold text-foreground group-data-[selected=true]:text-accent-foreground dark:text-ns-text dark:group-data-[selected=true]:text-white">
                {folder.name}
              </span>
            </div>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground dark:bg-ns-border-soft dark:text-ns-muted">
              {folder.count ?? 0} notes
            </span>
          </CommandItem>
        ))}

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
            Show {Math.min(DEFAULT_LIMIT, folders.length - limit)} more folders
          </button>
        )}
      </CommandGroup>
    </>
  )
}
