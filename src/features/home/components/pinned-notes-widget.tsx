import { useMemo } from 'react'
import { Pin, ArrowRight, Star } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  useNotesQuery,
  useTogglePinNoteMutation,
  useNoteTabsStore,
} from '@/features/notes'
import { useFoldersQuery } from '@/features/folder'

export function PinnedNotesWidget() {
  const navigate = useNavigate()
  const { openNoteTab, setActiveNoteTab } = useNoteTabsStore()

  // Real DB Queries for pinned notes
  const { data: pinnedNotes = [], isLoading } = useNotesQuery({
    isPinned: true,
    isTrash: false,
    limit: 8,
  })
  const { data: folders = [] } = useFoldersQuery()
  const togglePinMutation = useTogglePinNoteMutation()

  const folderMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const f of folders) {
      map.set(f.id, f.name)
    }
    return map
  }, [folders])

  const handleOpenNote = (note: (typeof pinnedNotes)[number]) => {
    const folderKey = note.folderId || 'default'
    openNoteTab(folderKey, {
      id: note.id,
      title: note.name,
      folderId: note.folderId ?? undefined,
      isPinned: true,
      updated: note.updatedAt
        ? new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
          }).format(new Date(note.updatedAt))
        : 'Recently',
      content: note.content ?? undefined,
    })
    setActiveNoteTab(folderKey, note.id)
    navigate({
      to: `/workspace/folder/${note.folderId || encodeURIComponent(note.name)}` as any,
    })
  }

  const handleUnpin = (
    e: React.MouseEvent,
    note: (typeof pinnedNotes)[number]
  ) => {
    e.stopPropagation()
    togglePinMutation.mutate(note.id)
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ns-border/30 bg-ns-panel/60 p-4 shadow-lg backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <Pin size={14} />
          </div>
          <h2 className="text-sm font-extrabold tracking-wide text-white">
            Pinned Notes
          </h2>
        </div>

        {pinnedNotes.length > 0 && (
          <span className="py-0.2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 text-[0.65rem] font-black text-amber-300">
            {pinnedNotes.length}
          </span>
        )}
      </div>

      {/* List / Empty State */}
      {isLoading ? (
        <div className="flex flex-col gap-2 py-1">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-12 w-full animate-pulse rounded-xl border border-ns-border/20 bg-ns-surface/40"
            />
          ))}
        </div>
      ) : pinnedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ns-border/30 bg-ns-surface/20 py-5 text-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
            <Star size={16} />
          </div>
          <p className="mt-1.5 text-xs font-semibold text-ns-muted">
            No pinned notes
          </p>
          <p className="mt-0.5 text-[0.65rem] text-ns-faint">
            Click the star icon on any note to pin it here
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {pinnedNotes.map((note) => {
            const folderName = note.folderId
              ? folderMap.get(note.folderId)
              : null
            const updatedFormatted = note.updatedAt
              ? new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                }).format(new Date(note.updatedAt))
              : 'Recently'

            return (
              <div
                key={note.id}
                onClick={() => handleOpenNote(note)}
                className="group flex cursor-pointer items-center justify-between gap-2.5 rounded-xl border border-ns-border/30 bg-ns-surface p-2.5 transition-all hover:border-amber-500/40 hover:bg-ns-hover active:scale-[0.99]"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300">
                    <Pin size={14} className="fill-amber-400/30" />
                  </div>

                  <div className="flex min-w-0 flex-col">
                    <h3 className="truncate text-xs font-bold text-white transition-colors group-hover:text-amber-300">
                      {note.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[0.6rem] font-medium text-ns-faint">
                      {folderName && (
                        <>
                          <span className="truncate font-semibold text-violet-300">
                            {folderName}
                          </span>
                          <span>•</span>
                        </>
                      )}
                      <span>{updatedFormatted}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => handleUnpin(e, note)}
                  type="button"
                  className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-amber-400 transition-colors hover:bg-amber-400/10"
                  title="Unpin"
                >
                  <Pin size={12} className="fill-amber-400" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer Link */}
      <Link
        to="/workspace/favorites"
        className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-ns-border/30 bg-ns-surface/50 py-2 text-[0.7rem] font-extrabold text-ns-ghost no-underline transition-all hover:border-amber-500/40 hover:text-amber-300"
      >
        <span>View all favorites</span>
        <ArrowRight size={12} />
      </Link>
    </div>
  )
}
