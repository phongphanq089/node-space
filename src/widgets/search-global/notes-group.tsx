import * as React from 'react'
import { FileText, Star, ChevronDown } from 'lucide-react'
import { CommandGroup, CommandItem, CommandSeparator } from '@/shared/ui'

export interface NoteRecord {
  id?: string
  name: string
  tags?: string[]
  updatedAt?: string | Date | null
  isPinned?: boolean | null
  isFavorite?: boolean | null
  folderId?: string | null
  folder_id?: string | null
  folderName?: string | null
  content?: string | null
}

const DEFAULT_LIMIT = 4

interface NotesGroupProps {
  notes: NoteRecord[]
  hasSeparatorAbove?: boolean
  onSelect: (note: NoteRecord) => void
}

export function NotesGroup({
  notes,
  hasSeparatorAbove = false,
  onSelect,
}: NotesGroupProps) {
  const [limit, setLimit] = React.useState(DEFAULT_LIMIT)
  const visible = notes.slice(0, limit)
  const hasMore = notes.length > limit

  if (notes.length === 0) return null

  return (
    <>
      {hasSeparatorAbove && <CommandSeparator />}
      <CommandGroup heading="Notes">
        {visible.map((note) => (
          <CommandItem
            key={note.id ?? note.name}
            onSelect={() => onSelect(note)}
            className="group flex items-center justify-between rounded-xl px-3 py-2.5 data-[selected=true]:bg-accent dark:data-[selected=true]:bg-ns-hover/60"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-emerald-500 dark:border-ns-border-soft dark:bg-ns-bg/60 dark:text-emerald-400">
                <FileText className="size-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground group-data-[selected=true]:text-accent-foreground dark:text-ns-text dark:group-data-[selected=true]:text-white">
                    {note.name}
                  </span>
                  {note.isPinned && (
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[0.68rem] text-muted-foreground dark:text-ns-muted">
                  {note.folderName && (
                    <>
                      <span className="max-w-[120px] truncate font-medium text-foreground/80 dark:text-ns-text/80">
                        {note.folderName}
                      </span>
                      <span>•</span>
                    </>
                  )}
                  {note.updatedAt && (
                    <span>
                      Updated{' '}
                      {note.updatedAt instanceof Date
                        ? note.updatedAt.toLocaleDateString()
                        : note.updatedAt}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center gap-1">
                {note.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border bg-background/50 px-1.5 py-0.5 text-[0.625rem] text-muted-foreground dark:border-ns-border-soft dark:bg-ns-bg/50 dark:text-ns-ghost"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
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
            Show {Math.min(DEFAULT_LIMIT, notes.length - limit)} more notes
          </button>
        )}
      </CommandGroup>
    </>
  )
}
