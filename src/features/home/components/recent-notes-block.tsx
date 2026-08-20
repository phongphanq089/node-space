import { useMemo } from 'react'
import {
  FileText,
  Star,
  Clock,
  ChevronRight,
  Plus,
  Sparkles,
} from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  useNotesQuery,
  useTogglePinNoteMutation,
  useNoteTabsStore,
} from '@/features/notes'
import { useFoldersQuery } from '@/features/folder'

interface RecentNotesBlockProps {
  searchQuery?: string
  onNewNote?: () => void
}

export function RecentNotesBlock({
  searchQuery = '',
  onNewNote,
}: RecentNotesBlockProps) {
  const navigate = useNavigate()
  const { openNoteTab, setActiveNoteTab } = useNoteTabsStore()

  // Real DB Queries
  const { data: serverNotes = [], isLoading } = useNotesQuery({
    limit: 10,
    isTrash: false,
    search: searchQuery || undefined,
  })
  const { data: folders = [] } = useFoldersQuery()

  const togglePinMutation = useTogglePinNoteMutation()

  // Map folder ID to folder name
  const folderMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const f of folders) {
      map.set(f.id, f.name)
    }
    return map
  }, [folders])

  const handleOpenNote = (n: (typeof serverNotes)[number]) => {
    const folderKey = n.folderId || 'default'
    openNoteTab(folderKey, {
      id: n.id,
      title: n.name,
      folderId: n.folderId ?? undefined,
      isPinned: n.isPinned ?? false,
      updated: n.updatedAt
        ? new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
          }).format(new Date(n.updatedAt))
        : 'Recently',
      content: n.content ?? undefined,
    })
    setActiveNoteTab(folderKey, n.id)
    navigate({
      to: `/workspace/folder/${n.folderId || encodeURIComponent(n.name)}` as any,
    })
  }

  const handleToggleStar = (
    e: React.MouseEvent,
    n: (typeof serverNotes)[number]
  ) => {
    e.stopPropagation()
    togglePinMutation.mutate(n.id)
  }

  // Format snippet text from markdown content
  const formatSnippet = (content?: string | null) => {
    if (!content) return 'No content yet...'
    return content
      .replace(/^[#\s*-_>`~]+/gm, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 110)
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ns-border/30 bg-ns-panel/60 p-4 shadow-lg backdrop-blur-md sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-400">
            <FileText size={14} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wide text-white">
              Recent Notes
            </h2>
            <p className="hidden text-[0.65rem] text-ns-faint sm:block">
              Jump back into your recent workspace documents
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNewNote && (
            <button
              type="button"
              onClick={onNewNote}
              className="flex h-7 cursor-pointer items-center gap-1 rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 text-[0.7rem] font-bold text-violet-300 transition-all hover:bg-violet-500/20 active:scale-95"
            >
              <Plus size={12} />
              <span>New Note</span>
            </button>
          )}

          <Link
            to="/workspace/folder"
            className="flex items-center gap-1 text-[0.7rem] font-bold whitespace-nowrap text-ns-ghost no-underline transition-colors hover:text-violet-400"
          >
            <span>View all</span>
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {/* Note List / Empty State / Loading */}
      {isLoading ? (
        <div className="flex flex-col gap-2 py-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 w-full animate-pulse rounded-xl border border-ns-border/20 bg-ns-surface/40"
            />
          ))}
        </div>
      ) : serverNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ns-border/40 bg-ns-surface/30 py-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
            <Sparkles size={20} />
          </div>
          <p className="mt-2 text-xs font-bold text-white">
            {searchQuery ? 'No matching notes found' : 'No notes created yet'}
          </p>
          <p className="mt-0.5 text-[0.65rem] text-ns-faint">
            {searchQuery
              ? 'Try searching for a different keyword'
              : 'Use the scratchpad above or create your first note to get started'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {serverNotes.slice(0, 6).map((note) => {
            const folderName = note.folderId
              ? folderMap.get(note.folderId) || 'Folder'
              : null

            const updatedFormatted = note.updatedAt
              ? new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                }).format(new Date(note.updatedAt))
              : 'Recently'

            const snippet = formatSnippet(note.content)

            return (
              <div
                key={note.id}
                onClick={() => handleOpenNote(note)}
                className="group flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-ns-border/30 bg-ns-surface/80 p-3 transition-all hover:-translate-y-0.5 hover:border-violet-500/50 hover:bg-ns-hover active:scale-[0.99]"
              >
                {/* Left info & snippet */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-xs font-bold text-white transition-colors group-hover:text-violet-300 sm:text-sm">
                      {note.name}
                    </h3>

                    {folderName && (
                      <span className="hidden items-center rounded-full border border-violet-400/20 bg-violet-500/10 px-2 py-0.5 text-[0.55rem] font-extrabold text-violet-300 sm:inline-flex">
                        📁 {folderName}
                      </span>
                    )}

                    {note.isPinned && (
                      <span className="py-0.2 inline-flex items-center gap-0.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-1.5 text-[0.55rem] font-bold text-amber-300">
                        <Star size={9} className="fill-amber-400" />
                        <span>Pinned</span>
                      </span>
                    )}
                  </div>

                  {/* Content Snippet */}
                  <p className="line-clamp-1 text-[0.7rem] text-ns-faint group-hover:text-ns-muted">
                    {snippet}
                  </p>

                  {/* Metadata Row */}
                  <div className="mt-0.5 flex items-center gap-3 text-[0.65rem] font-medium text-ns-ghost">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {updatedFormatted}
                    </span>

                    {Array.isArray(note.tags) && note.tags.length > 0 && (
                      <div className="hidden items-center gap-1 sm:flex">
                        {note.tags.slice(0, 2).map((t: string) => (
                          <span
                            key={t}
                            className="py-0.2 rounded bg-white/5 px-1.5 text-[0.6rem] text-ns-faint"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Star / Pin Button */}
                <button
                  onClick={(e) => handleToggleStar(e, note)}
                  type="button"
                  className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-all ${
                    note.isPinned
                      ? 'text-amber-400 hover:bg-amber-400/10'
                      : 'text-ns-ghost hover:bg-white/5 hover:text-amber-400'
                  }`}
                  title={note.isPinned ? 'Unpin note' : 'Pin note'}
                >
                  <Star
                    size={14}
                    className={note.isPinned ? 'fill-amber-400' : ''}
                  />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
