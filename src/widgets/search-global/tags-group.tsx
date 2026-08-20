import * as React from 'react'
import { Tag, ChevronDown } from 'lucide-react'
import { CommandGroup, CommandItem, CommandSeparator } from '@/shared/ui'

interface TagRecord {
  id: string
  name: string
  count?: number
}

const DEFAULT_LIMIT = 5

interface TagsGroupProps {
  tags: TagRecord[]
  hasSeparatorAbove?: boolean
  onSelect: (tag: TagRecord) => void
}

export function TagsGroup({
  tags,
  hasSeparatorAbove = false,
  onSelect,
}: TagsGroupProps) {
  const [limit, setLimit] = React.useState(DEFAULT_LIMIT)
  const visible = tags.slice(0, limit)
  const hasMore = tags.length > limit

  if (tags.length === 0) return null

  return (
    <>
      {hasSeparatorAbove && <CommandSeparator />}
      <CommandGroup heading="Tags">
        {visible.map((tag) => (
          <CommandItem
            key={tag.id}
            onSelect={() => onSelect(tag)}
            className="group flex items-center justify-between rounded-xl px-3 py-2.5 data-[selected=true]:bg-accent dark:data-[selected=true]:bg-ns-hover/60"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-violet-500 dark:border-ns-border-soft dark:bg-ns-bg/60 dark:text-violet-400">
                <Tag className="size-4" />
              </div>
              <span className="text-xs font-semibold text-foreground group-data-[selected=true]:text-accent-foreground dark:text-ns-text dark:group-data-[selected=true]:text-white">
                #{tag.name}
              </span>
            </div>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground dark:bg-ns-border-soft dark:text-ns-muted">
              {tag.count ?? 0} items
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
            Show {Math.min(DEFAULT_LIMIT, tags.length - limit)} more tags
          </button>
        )}
      </CommandGroup>
    </>
  )
}
