import { FileText, Plus, Star } from 'lucide-react'
import type { NoteItem } from '@/constants/moc-data'

interface NotesSidebarProps {
  open: boolean
  notes: readonly NoteItem[]
  selectedNote: NoteItem
  onSelectNote: (note: NoteItem) => void
}

export function NotesSidebar({
  open,
  notes,
  selectedNote,
  onSelectNote,
}: NotesSidebarProps) {
  return (
    <aside
      className={`flex flex-col overflow-hidden border-r border-ns-border-soft bg-ns-panel transition-all duration-300 ease-in-out ${
        open ? 'w-64 min-w-[256px]' : 'w-0 min-w-0'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-ns-border-soft px-3 py-2.5">
        <span className="text-[0.6rem] font-bold tracking-wider text-ns-muted uppercase">
          Notes
        </span>
        <span className="rounded-full bg-ns-active px-1.5 py-0.5 text-[0.55rem] font-bold text-ns-primary-lt">
          {notes.length}
        </span>
      </div>

      {/* Note list */}
      <div className="no-scrollbar flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {notes.map((note) => {
          const isActive = note.title === selectedNote.title
          return (
            <button
              key={note.title}
              onClick={() => onSelectNote(note)}
              className={`group flex w-full cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                isActive
                  ? 'border-ns-border-em bg-gradient-to-br from-ns-active/50 to-ns-hover/20 shadow-sm'
                  : 'border-transparent hover:border-ns-border-soft/60 hover:bg-ns-hover/40'
              }`}
            >
              {/* Icon */}
              <div
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg shadow-inner transition-colors ${
                  isActive
                    ? 'bg-ns-primary/20 text-ns-primary-lt'
                    : 'bg-ns-active/60 text-ns-ghost group-hover:text-ns-muted'
                }`}
              >
                <FileText size={12} />
              </div>

              {/* Note info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p
                    className={`truncate text-xs font-bold ${
                      isActive
                        ? 'text-ns-primary-lt'
                        : 'text-ns-text-2 group-hover:text-ns-text'
                    }`}
                  >
                    {note.title}
                  </p>
                  {note.starred && (
                    <Star
                      size={10}
                      fill="#fbbf24"
                      className="flex-shrink-0 text-amber-400"
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
                <p className="mt-1 text-[0.55rem] text-ns-faint">
                  {note.updated}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Add note */}
      <div className="border-t border-ns-border-soft p-2">
        <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-ns-border-soft py-2 text-[0.65rem] font-bold text-ns-ghost transition-all hover:border-ns-primary/40 hover:bg-ns-primary/5 hover:text-ns-primary-lt">
          <Plus size={12} />
          <span>New Note</span>
        </button>
      </div>
    </aside>
  )
}
