import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Star,
  FileText,
  ArrowUpRight,
  Heart,
  Folder,
  Search,
  Bookmark,
} from 'lucide-react'
import { NOTES } from '@/shared/mocks/mock-data'
import { Button, Input, EmptyState } from '@/shared/ui'
import {
  useFoldersQuery,
  useToggleFavoriteFolderMutation,
} from '@/features/folder'

export const Route = createFileRoute('/_workspace/workspace/favorites')({
  component: FavoritesPage,
})

function FavoritesPage() {
  const [filter, setFilter] = useState<'all' | 'folders' | 'notes'>('all')
  const [search, setSearch] = useState('')

  const { data: dbFolders = [] } = useFoldersQuery()
  const toggleFavoriteMutation = useToggleFavoriteFolderMutation()

  const starredFolders = dbFolders.filter((f) => f.isFavorite)
  const starredNotes = NOTES.filter((n) => n.starred)

  const filteredFolders = starredFolders.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )
  const filteredNotes = starredNotes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  )

  const totalCount = starredFolders.length + starredNotes.length

  return (
    <div className="flex flex-1 flex-col gap-6 bg-ns-bg p-4 font-sans sm:p-6 lg:p-8">
      {/* ── Top Hero Header ────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-ns-border-md bg-ns-surface/90 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        <div className="ns-orb-pink-25 pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-30 blur-3xl" />
        <div className="ns-orb-amber-25 pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full opacity-20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-[0.7rem] font-semibold text-pink-400">
              <Heart className="size-3.5 fill-pink-400" />
              <span>Starred Collection</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              Favorites & Bookmarks
            </h1>
            <p className="max-w-xl text-xs text-ns-muted sm:text-sm">
              Quick access to your favorited folders, core documentation, and
              starred research notes.
            </p>
          </div>

          {/* Quick Counter Cards */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center rounded-xl border border-ns-border-soft bg-ns-bg/50 px-4 py-2.5 backdrop-blur-md">
              <span className="text-lg font-bold text-white">
                {starredFolders.length}
              </span>
              <span className="text-[0.65rem] font-semibold tracking-wider text-ns-ghost uppercase">
                Folders
              </span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-ns-border-soft bg-ns-bg/50 px-4 py-2.5 backdrop-blur-md">
              <span className="text-lg font-bold text-white">
                {starredNotes.length}
              </span>
              <span className="text-[0.65rem] font-semibold tracking-wider text-ns-ghost uppercase">
                Notes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search & Filter Controls ────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Filter favorites..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            suffix={<Search size={14} className="text-ns-ghost" />}
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 rounded-xl border border-ns-border-soft bg-ns-panel/80 p-1 backdrop-blur-md">
          {(
            [
              { id: 'all', label: 'All Items', count: totalCount },
              { id: 'folders', label: 'Folders', count: starredFolders.length },
              { id: 'notes', label: 'Notes', count: starredNotes.length },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-ns-primary text-white shadow-md'
                  : 'text-ns-ghost hover:bg-ns-hover hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="py-0.2 rounded-full bg-white/20 px-1.5 text-[0.6rem]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Content Grid ───────────────────────────────────────────── */}
      {totalCount === 0 ? (
        <EmptyState
          variant="search"
          title="No Favorites Saved"
          description="Click the star icon on any folder or note to add it to your favorites list."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Starred Folders Section */}
          {(filter === 'all' || filter === 'folders') && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-ns-border-soft pb-2">
                <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-ns-muted uppercase">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span>Starred Folders ({filteredFolders.length})</span>
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {filteredFolders.map((folderItem) => (
                  <div
                    key={folderItem.id}
                    className="group relative flex items-center justify-between gap-4 rounded-xl border border-ns-border-soft bg-ns-panel/70 p-4 transition-all hover:border-amber-500/50 hover:bg-ns-panel hover:shadow-xl"
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      {folderItem.image ? (
                        <img
                          src={folderItem.image}
                          alt={folderItem.name}
                          className="size-12 shrink-0 rounded-xl border border-ns-border-soft object-cover shadow-sm transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-ns-border-soft shadow-inner"
                          style={{
                            background: `linear-gradient(135deg, ${
                              folderItem.color ?? '#3b82f6'
                            }22, ${folderItem.color ?? '#3b82f6'}44)`,
                          }}
                        >
                          <Folder
                            size={22}
                            style={{ color: folderItem.color ?? '#60a5fa' }}
                          />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-bold text-white transition-colors group-hover:text-amber-300">
                            {folderItem.name}
                          </h3>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-ns-muted">
                          <span>Folder</span>
                          <span>•</span>
                          <span className="text-ns-ghost">
                            Created{' '}
                            {folderItem.createdAt
                              ? new Date(
                                  folderItem.createdAt
                                ).toLocaleDateString()
                              : 'Recently'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          toggleFavoriteMutation.mutate(folderItem.id)
                        }
                        className="text-amber-400 hover:bg-ns-hover hover:text-amber-300"
                        title="Remove from favorites"
                      >
                        <Star className="size-4 fill-amber-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-ns-ghost hover:bg-ns-hover hover:text-white"
                        title="Open folder"
                      >
                        <ArrowUpRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredFolders.length === 0 && filter === 'folders' && (
                  <div className="py-8 text-center text-xs text-ns-ghost">
                    No matching starred folders found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bookmarked Notes Section */}
          {(filter === 'all' || filter === 'notes') && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-ns-border-soft pb-2">
                <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-ns-muted uppercase">
                  <Bookmark className="size-4 text-ns-primary-lt" />
                  <span>Starred Notes ({filteredNotes.length})</span>
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {filteredNotes.map((note) => (
                  <div
                    key={note.title}
                    className="group relative flex items-center justify-between gap-4 rounded-xl border border-ns-border-soft bg-ns-panel/70 p-4 transition-all hover:border-ns-primary/50 hover:bg-ns-panel hover:shadow-xl"
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-ns-border-soft bg-ns-primary/20 text-ns-primary-lt shadow-inner">
                        <FileText size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-bold text-white transition-colors group-hover:text-ns-primary-lt">
                          {note.title}
                        </h3>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {note.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-md border border-ns-border-soft bg-ns-hover/50 px-2 py-0.5 text-[0.65rem] font-medium text-ns-primary-lt"
                            >
                              {t}
                            </span>
                          ))}
                          <span className="text-[0.65rem] text-ns-ghost">
                            • {note.updated}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-ns-ghost hover:bg-ns-hover hover:text-white"
                      title="Read note"
                    >
                      <ArrowUpRight className="size-4" />
                    </Button>
                  </div>
                ))}

                {filteredNotes.length === 0 && filter === 'notes' && (
                  <div className="py-8 text-center text-xs text-ns-ghost">
                    No matching starred notes found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
