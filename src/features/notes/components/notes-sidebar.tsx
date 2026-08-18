import { useState } from 'react'
import { FileText, Plus, Search, Star, X } from 'lucide-react'
import type { NoteItem } from '@/shared/mocks/mock-data'

import { cn } from '@/shared/lib/utils'
import { Button, Input } from '@/shared/ui'
import { useNewNoteDialogStore } from '../store/use-new-note-dialog-store'

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

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-ns-border-soft bg-ns-panel/80 backdrop-blur-md transition-all duration-300',
        open ? 'w-72 shrink-0' : 'w-0 overflow-hidden border-none opacity-0'
      )}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-ns-primary-lt" />
          <span className="text-xs font-bold tracking-wider text-ns-text uppercase">
            All Notes ({notes.length})
          </span>
        </div>

        {/* Mobile close */}
        {onCloseMobile && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onCloseMobile}
            className="md:hidden"
          >
            <X size={14} />
          </Button>
        )}
      </div>

      {/* Filter / Search input */}
      <div className="w-full px-2">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
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
                    : 'border-ns-primary/30! bg-ns-bg/30 hover:border-ns-border-soft hover:bg-ns-hover/40'
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
        <Button
          onClick={() => useNewNoteDialogStore.getState().open()}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-ns-primary py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-ns-primary/80"
        >
          <Plus size={14} />
          <span>New Note</span>
        </Button>
      </div>
    </aside>
  )
}
