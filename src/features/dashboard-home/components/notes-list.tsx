import { NOTES } from '@/constants/moc-data'
import {
  FileText,
  Star,
  MoreHorizontal,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
} from 'lucide-react'

export default function NotesList() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-ns-border bg-ns-panel shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ns-border-soft px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider text-ns-muted uppercase">
            Notes in Node
          </span>
          <span className="text-ns-primary-lt rounded-full bg-ns-active px-2 py-0.5 text-[0.62rem] font-semibold">
            6 notes
          </span>
        </div>
        <div className="flex gap-1.5 text-ns-ghost">
          <button
            className="hover:text-ns-primary-lt flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-ns-hover"
            title="Filter"
          >
            <Filter size={13} />
          </button>
          <button
            className="hover:text-ns-primary-lt flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-ns-hover"
            title="Sort"
          >
            <SlidersHorizontal size={13} />
          </button>
          <button
            className="hover:text-ns-primary-lt flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-ns-hover"
            title="Grid View"
          >
            <LayoutGrid size={13} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {NOTES.map((note) => (
          <div
            key={note.title}
            className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all hover:bg-ns-hover/50"
          >
            {/* Note Icon Container */}
            <div className="text-ns-primary-lt flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-ns-active shadow-inner">
              <FileText size={14} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1.5">
                <p className="truncate text-xs font-bold text-ns-text">
                  {note.title}
                </p>
                <div className="flex flex-shrink-0 items-center gap-1.5">
                  {note.starred && (
                    <Star size={11} fill="#fbbf24" className="text-amber-400" />
                  )}
                  <button className="hover:text-ns-primary-lt cursor-pointer text-ns-ghost opacity-0 transition-opacity group-hover:opacity-100">
                    <MoreHorizontal size={13} />
                  </button>
                </div>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {note.tags.map((t) => (
                  <span
                    key={t}
                    className="text-ns-primary-lt rounded-md border border-ns-border/40 bg-ns-hover/80 px-1.5 py-0.5 text-[0.58rem] font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-1.5 text-[0.58rem] font-medium text-ns-faint">
                Updated {note.updated}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
