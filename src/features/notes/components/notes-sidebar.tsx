import { useState } from 'react'
import { FileText, Plus, Search, Star, X } from 'lucide-react'
import type { NoteItem } from '@/shared/constants/moc-data'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/core/button'
import Input from '@/shared/ui/core/input'

interface NotesSidebarProps {
  open: boolean
  notes: readonly NoteItem[]
  selectedNote: NoteItem
  onSelectNote: (note: NoteItem) => void
  onCloseMobile?: () => void
}

export function NotesSidebar({
  open,
  notes,
  selectedNote,
  onSelectNote,
  onCloseMobile,
}: NotesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col border-r border-ns-border-soft bg-ns-panel/95 backdrop-blur-md transition-all duration-300 ease-in-out',
        // Desktop responsive
        'md:relative md:top-0 md:h-full',
        open
          ? 'md:w-64 md:min-w-[256px]'
          : 'md:pointer-events-none md:w-0 md:min-w-0 md:overflow-hidden md:opacity-0',
        // Mobile responsive drawer
        'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:h-full max-md:w-72 max-md:max-w-[85vw] max-md:shadow-2xl',
        open ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-ns-border-soft px-3.5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[0.65rem] font-bold tracking-wider text-ns-muted uppercase">
            Notes
          </span>
          <span className="rounded-full bg-ns-active px-2 py-0.5 text-[0.6rem] font-bold text-ns-primary-lt">
            {notes.length}
          </span>
        </div>

        {/* Close Button for Mobile Drawer */}
        {onCloseMobile && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onCloseMobile}
            className="text-ns-ghost hover:text-white md:hidden"
            title="Close panel"
          >
            <X size={15} />
          </Button>
        )}
      </div>

      {/* Filter / Search input */}
      <div className="w-full px-2">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          suffix={<Search size={13} />}
        />
      </div>

      {/* Note list */}
      <div className="no-scrollbar flex flex-1 flex-col space-y-1.5 overflow-y-auto p-2">
        {filteredNotes.length === 0 ? (
          <div className="py-8 text-center text-xs text-ns-ghost">
            No notes found
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isActive = note.title === selectedNote.title
            return (
              <Button
                key={note.title}
                onClick={() => onSelectNote(note)}
                variant="outline"
                className={cn(
                  'group flex h-auto w-full cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 text-left transition-all',
                  isActive
                    ? 'border-ns-primary/60 bg-gradient-to-br from-ns-active/60 to-ns-hover/30 shadow-sm'
                    : 'border-ns-border-soft/60 bg-ns-bg/30 hover:border-ns-border-soft hover:bg-ns-hover/40'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md shadow-xs transition-colors',
                    isActive
                      ? 'bg-ns-primary/20 text-ns-primary-lt'
                      : 'bg-ns-active/40 text-ns-ghost group-hover:text-ns-muted'
                  )}
                >
                  <FileText size={13} />
                </div>

                {/* Note info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p
                      className={cn(
                        'truncate text-xs font-semibold',
                        isActive ? 'font-bold text-ns-primary-lt' : 'text-white'
                      )}
                    >
                      {note.title}
                    </p>
                    {note.starred && (
                      <Star
                        size={10}
                        fill="#fbbf24"
                        className="shrink-0 text-amber-400"
                      />
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {note.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="rounded border border-ns-border/30 bg-ns-hover/60 px-1 py-0.5 text-[0.52rem] font-semibold text-ns-primary-lt"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-[0.55rem] text-ns-ghost">
                    {note.updated}
                  </p>
                </div>
              </Button>
            )
          })
        )}
      </div>

      {/* Action Footer */}
      <div className="border-t border-ns-border-soft bg-ns-panel/80 p-2">
        <Button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-ns-primary py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-ns-primary/80">
          <Plus size={14} />
          <span>New Note</span>
        </Button>
      </div>
    </aside>
  )
}
