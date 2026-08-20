import { useState, useMemo } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Star,
  FileText,
  ArrowUpRight,
  Folder,
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  Link2,
  Clock,
  X,
  Check,
  FolderOpen,
} from 'lucide-react'
import { Button, Input, ShowcaseEmptyState } from '@/shared/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/core/dropdown-menu'
import { Skeleton } from '@/shared/ui/core/skeleton'
import {
  useFoldersQuery,
  useToggleFavoriteFolderMutation,
} from '@/features/folder'
import {
  useNotesQuery,
  useToggleFavoriteNoteMutation,
  useNoteTabsStore,
} from '@/features/notes'
import { toast } from 'sonner'
import { cn } from '@/shared/lib/utils'

export const Route = createFileRoute('/_workspace/workspace/favorites')({
  component: FavoritesPage,
})

type FilterType = 'all' | 'folders' | 'notes'
type SortType = 'updated_desc' | 'updated_asc' | 'name_asc' | 'name_desc'
type ViewMode = 'grid' | 'list'

const SORT_LABELS: Record<SortType, string> = {
  updated_desc: 'Recently Updated',
  updated_asc: 'Oldest Updated',
  name_asc: 'Name (A to Z)',
  name_desc: 'Name (Z to A)',
}

function FavoritesPage() {
  const navigate = useNavigate()
  const { openNoteTab, setActiveNoteTab } = useNoteTabsStore()

  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortType>('updated_desc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const { data: dbFolders = [], isLoading: isLoadingFolders } =
    useFoldersQuery()
  const { data: dbNotes = [], isLoading: isLoadingNotes } = useNotesQuery()
  const toggleFavoriteFolderMutation = useToggleFavoriteFolderMutation()
  const toggleFavoriteNoteMutation = useToggleFavoriteNoteMutation()

  const isLoading = isLoadingFolders || isLoadingNotes

  // Mapping notes count per folder
  const notesCountByFolder = useMemo(() => {
    const map = new Map<string, number>()
    for (const n of dbNotes) {
      if (n.folderId) {
        map.set(n.folderId, (map.get(n.folderId) || 0) + 1)
      }
    }
    return map
  }, [dbNotes])

  // Mapping folder lookup by ID
  const folderMap = useMemo(() => {
    const map = new Map<string, { name: string; color?: string | null }>()
    for (const f of dbFolders) {
      map.set(f.id, { name: f.name, color: f.color })
    }
    return map
  }, [dbFolders])

  // Filtered lists
  const starredFolders = useMemo(
    () => dbFolders.filter((f) => f.isFavorite),
    [dbFolders]
  )
  const starredNotes = useMemo(
    () => dbNotes.filter((n) => n.isFavorite),
    [dbNotes]
  )

  // Search and Sort Folders
  const filteredFolders = useMemo(() => {
    const query = search.trim().toLowerCase()
    const list = starredFolders.filter((f) => {
      if (!query) return true
      const matchName = f.name.toLowerCase().includes(query)
      const matchTags = Array.isArray(f.tags)
        ? f.tags.some((t: string) => t.toLowerCase().includes(query))
        : false
      return matchName || matchTags
    })

    return list.sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name)
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return sortBy === 'updated_desc' ? dateB - dateA : dateA - dateB
    })
  }, [starredFolders, search, sortBy])

  // Search and Sort Notes
  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase()
    const list = starredNotes.filter((n) => {
      if (!query) return true
      const matchName = n.name.toLowerCase().includes(query)
      const matchContent = n.content
        ? n.content.toLowerCase().includes(query)
        : false
      const matchTags = Array.isArray(n.tags)
        ? n.tags.some((t: string) => t.toLowerCase().includes(query))
        : false
      return matchName || matchContent || matchTags
    })

    return list.sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name)
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return sortBy === 'updated_desc' ? dateB - dateA : dateA - dateB
    })
  }, [starredNotes, search, sortBy])

  const totalRawCount = starredFolders.length + starredNotes.length
  const totalFilteredCount = filteredFolders.length + filteredNotes.length

  // Handlers
  const handleOpenFolder = (folderId: string) => {
    navigate({
      to: `/workspace/folder/${folderId}` as any,
    })
  }

  const handleOpenNote = (note: (typeof dbNotes)[number]) => {
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

  const handleCopyLink = (path: string, title: string) => {
    const url = `${window.location.origin}${path}`
    void navigator.clipboard.writeText(url)
    toast.success(`Copied link to "${title}"`)
  }

  const handleToggleFolderFavorite = (
    e: React.MouseEvent,
    folderId: string
  ) => {
    e.stopPropagation()
    toggleFavoriteFolderMutation.mutate(folderId)
  }

  const handleToggleNoteFavorite = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation()
    toggleFavoriteNoteMutation.mutate(noteId)
  }

  // Format Helper
  const formatDate = (dateValue?: Date | string | null) => {
    if (!dateValue) return 'Recently'
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(dateValue))
    } catch {
      return 'Recently'
    }
  }

  const cleanSnippet = (content?: string | null) => {
    if (!content) return ''
    return content
      .replace(/[#*`_~>[\]()]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 140)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-3 font-sans sm:p-6 lg:p-8">
      {/* ── Top Hero Banner ────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-ns-border-md bg-ns-surface/80 p-6 shadow-sm backdrop-blur-xl transition-all sm:p-8 dark:bg-ns-surface/90 dark:shadow-2xl">
        {/* Subtle Ambient Light Orbs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/10 opacity-70 blur-3xl dark:bg-amber-500/20 dark:opacity-40" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-ns-primary/10 opacity-70 blur-3xl dark:bg-ns-primary/20 dark:opacity-40" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Star className="size-3.5 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
              <span>Starred Collection</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-ns-text sm:text-3xl lg:text-4xl">
              Favorites & Starred
            </h1>

            <p className="max-w-xl text-xs leading-relaxed text-ns-muted sm:text-sm">
              Quick access to your prioritized workspace folders, key
              documentation, and starred research notes.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-ns-border-soft bg-ns-bg/80 px-4 py-2.5 shadow-xs backdrop-blur-md sm:min-w-24 sm:flex-initial">
              <span className="text-xl font-extrabold text-ns-text">
                {isLoading ? <Skeleton className="h-6 w-8" /> : totalRawCount}
              </span>
              <span className="text-[0.65rem] font-bold tracking-wider text-ns-ghost uppercase">
                Total
              </span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-ns-border-soft bg-ns-bg/80 px-4 py-2.5 shadow-xs backdrop-blur-md sm:min-w-24 sm:flex-initial">
              <div className="flex items-center gap-1.5">
                <Folder className="size-3.5 text-blue-500" />
                <span className="text-xl font-extrabold text-ns-text">
                  {isLoading ? (
                    <Skeleton className="h-6 w-8" />
                  ) : (
                    starredFolders.length
                  )}
                </span>
              </div>
              <span className="text-[0.65rem] font-bold tracking-wider text-ns-ghost uppercase">
                Folders
              </span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-ns-border-soft bg-ns-bg/80 px-4 py-2.5 shadow-xs backdrop-blur-md sm:min-w-24 sm:flex-initial">
              <div className="flex items-center gap-1.5">
                <FileText className="size-3.5 text-ns-primary" />
                <span className="text-xl font-extrabold text-ns-text">
                  {isLoading ? (
                    <Skeleton className="h-6 w-8" />
                  ) : (
                    starredNotes.length
                  )}
                </span>
              </div>
              <span className="text-[0.65rem] font-bold tracking-wider text-ns-ghost uppercase">
                Notes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search, Filter & View Controls Bar ──────────────────────── */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search input */}
        <div className="relative w-full lg:max-w-sm">
          <Input
            placeholder="Search favorites by name, tag, or content..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            prefix={<Search size={15} className="text-ns-ghost" />}
            suffix={
              search ? (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="cursor-pointer rounded-full p-0.5 text-ns-ghost hover:bg-ns-hover hover:text-ns-text"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              ) : null
            }
            className="border-ns-border-soft bg-ns-surface text-xs shadow-xs focus:border-ns-primary focus:ring-ns-primary/20"
          />
        </div>

        {/* Right: Filter Tabs, Sort Dropdown & View Mode */}
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-ns-border-soft bg-ns-surface p-1 shadow-xs">
            {(
              [
                { id: 'all', label: 'All', count: totalRawCount },
                {
                  id: 'folders',
                  label: 'Folders',
                  count: starredFolders.length,
                  icon: Folder,
                },
                {
                  id: 'notes',
                  label: 'Notes',
                  count: starredNotes.length,
                  icon: FileText,
                },
              ] as const
            ).map((tab) => {
              const Icon = 'icon' in tab ? tab.icon : null
              const isActive = filter === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={cn(
                    'flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-ns-primary text-white shadow-xs'
                      : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text'
                  )}
                >
                  {Icon && <Icon className="size-3.5" />}
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[0.625rem] font-bold',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-ns-surface-alt text-ns-muted'
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-ns-border-soft bg-ns-surface text-xs text-ns-text hover:bg-ns-hover"
              >
                <ArrowUpDown size={13} className="text-ns-ghost" />
                <span className="hidden text-ns-muted sm:inline">Sort:</span>
                <span className="font-semibold">{SORT_LABELS[sortBy]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl border border-ns-border-soft bg-ns-panel p-1 text-xs shadow-xl"
            >
              {(Object.keys(SORT_LABELS) as SortType[]).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setSortBy(key)}
                  className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-ns-text hover:bg-ns-hover"
                >
                  <span>{SORT_LABELS[key]}</span>
                  {sortBy === key && (
                    <Check size={14} className="text-ns-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle (Grid / List) */}
          <div className="flex items-center rounded-xl border border-ns-border-soft bg-ns-surface p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors',
                viewMode === 'grid'
                  ? 'bg-ns-primary text-white shadow-xs'
                  : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text'
              )}
              title="Grid View"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors',
                viewMode === 'list'
                  ? 'bg-ns-primary text-white shadow-xs'
                  : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text'
              )}
              title="List View"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content Section ────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-2xl border border-ns-border-soft bg-ns-surface p-4 shadow-xs"
            >
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : totalRawCount === 0 ? (
        /* Empty State: No favorites saved anywhere */
        <ShowcaseEmptyState
          badgeText="Starred Collection"
          title={
            <>
              Nothing starred yet —{' '}
              <span className="font-extrabold text-ns-text">
                star your favorites
              </span>{' '}
              to keep them here.
            </>
          }
          description="You haven't starred any folders or notes yet. Click the star icon on any project or document to pin your essential items here."
          primaryAction={{
            label: 'Browse Folders',
            onClick: () => navigate({ to: '/workspace/folder' as any }),
            icon: <FolderOpen size={15} />,
          }}
          secondaryAction={{
            label: 'Go to Workspace Home',
            onClick: () => navigate({ to: '/workspace' as any }),
          }}
        />
      ) : totalFilteredCount === 0 ? (
        /* Empty State: Filter or Search returned 0 results */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ns-border-md bg-ns-surface/40 px-6 py-16 text-center shadow-xs backdrop-blur-sm">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-ns-border-soft bg-ns-surface text-ns-ghost shadow-xs">
            <Search className="size-6" />
          </div>
          <h2 className="text-base font-bold text-ns-text">
            No Matching Favorites Found
          </h2>
          <p className="mt-1 max-w-sm text-xs text-ns-muted">
            {search ? (
              <>
                No favorites matching{' '}
                <span className="font-semibold text-ns-text">"{search}"</span>.
              </>
            ) : (
              'No items match the selected category filter.'
            )}
          </p>
          {search && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearch('')}
              className="mt-4 gap-1.5 border-ns-border-soft text-xs"
            >
              <X size={13} />
              <span>Clear Search Query</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* ── Folders Section ──────────────────────────────────────── */}
          {(filter === 'all' || filter === 'folders') &&
            filteredFolders.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-ns-border-soft pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-500 dark:text-amber-400">
                      <Folder size={14} />
                    </div>
                    <h2 className="text-sm font-extrabold tracking-wide text-ns-text">
                      Starred Folders
                    </h2>
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[0.65rem] font-bold text-amber-600 dark:text-amber-400">
                      {filteredFolders.length}
                    </span>
                  </div>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredFolders.map((folder) => {
                      const folderColor = folder.color || '#6366f1'
                      const noteCount = notesCountByFolder.get(folder.id) || 0
                      const tagsList = Array.isArray(folder.tags)
                        ? folder.tags
                        : []

                      return (
                        <div
                          key={folder.id}
                          onClick={() => handleOpenFolder(folder.id)}
                          style={
                            {
                              '--folder-accent': folderColor,
                            } as React.CSSProperties
                          }
                          className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-ns-border-soft bg-ns-surface p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[var(--folder-accent)] hover:shadow-lg dark:bg-ns-panel/70 dark:hover:shadow-[0_0_25px_rgba(0,0,0,0.5)]"
                        >
                          {/* Folder Visual / Thumbnail */}
                          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-ns-surface-alt">
                            {folder.image ? (
                              <img
                                src={folder.image}
                                alt={folder.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div
                                className="flex h-full w-full items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${folderColor}15, ${folderColor}35)`,
                                }}
                              >
                                <Folder
                                  size={36}
                                  style={{ color: folderColor }}
                                  className="transition-transform duration-300 group-hover:scale-110"
                                />
                              </div>
                            )}

                            {/* Top-Right Favorite Button */}
                            <button
                              type="button"
                              onClick={(e) =>
                                handleToggleFolderFavorite(e, folder.id)
                              }
                              className="absolute top-2.5 right-2.5 z-10 flex size-8 cursor-pointer items-center justify-center rounded-lg border border-black/10 bg-white/90 text-amber-500 shadow-xs backdrop-blur-md transition-all hover:scale-110 hover:bg-white active:scale-95 dark:border-white/15 dark:bg-black/60 dark:text-amber-400 dark:hover:bg-black/80"
                              title="Remove from favorites"
                            >
                              <Star className="size-4 fill-amber-500 dark:fill-amber-400" />
                            </button>
                          </div>

                          {/* Info Body */}
                          <div className="mt-3.5 flex flex-1 flex-col justify-between">
                            <div>
                              {/* Tags row */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                {tagsList.length > 0 ? (
                                  tagsList.slice(0, 3).map((tag: string) => (
                                    <span
                                      key={tag}
                                      className="rounded-md border border-ns-primary/20 bg-ns-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-ns-primary dark:text-ns-primary-lt"
                                    >
                                      #{tag}
                                    </span>
                                  ))
                                ) : (
                                  <span className="rounded-md border border-ns-border-soft bg-ns-surface-alt px-2 py-0.5 font-mono text-[10px] font-medium text-ns-ghost">
                                    #folder
                                  </span>
                                )}
                                {tagsList.length > 3 && (
                                  <span className="text-[10px] font-medium text-ns-ghost">
                                    +{tagsList.length - 3}
                                  </span>
                                )}
                              </div>

                              {/* Title */}
                              <h3 className="mt-2.5 line-clamp-1 text-base font-bold text-ns-text transition-colors group-hover:text-[var(--folder-accent)]">
                                {folder.name}
                              </h3>

                              {/* Subtitle details */}
                              <div className="mt-1 flex items-center gap-2 text-xs text-ns-muted">
                                <span className="font-semibold text-ns-text">
                                  {noteCount}{' '}
                                  {noteCount === 1 ? 'note' : 'notes'}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-ns-ghost">
                                  <Clock size={11} />
                                  {formatDate(
                                    folder.updatedAt || folder.createdAt
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Card Bottom Actions */}
                            <div className="mt-4 flex items-center justify-between border-t border-ns-border-soft pt-3">
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="size-2.5 rounded-full"
                                  style={{ backgroundColor: folderColor }}
                                />
                                <span className="text-[11px] font-semibold text-ns-muted">
                                  Folder
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCopyLink(
                                      `/workspace/folder/${folder.id}`,
                                      folder.name
                                    )
                                  }}
                                  className="text-ns-ghost hover:bg-ns-hover hover:text-ns-text"
                                  title="Copy folder link"
                                >
                                  <Link2 size={14} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-ns-ghost hover:bg-ns-hover hover:text-ns-text"
                                  title="Open folder"
                                >
                                  <ArrowUpRight size={14} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  /* List View for Folders */
                  <div className="flex flex-col gap-2">
                    {filteredFolders.map((folder) => {
                      const folderColor = folder.color || '#6366f1'
                      const noteCount = notesCountByFolder.get(folder.id) || 0
                      const tagsList = Array.isArray(folder.tags)
                        ? folder.tags
                        : []

                      return (
                        <div
                          key={folder.id}
                          onClick={() => handleOpenFolder(folder.id)}
                          className="group relative flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-ns-border-soft bg-ns-surface p-3.5 shadow-xs transition-all hover:border-ns-border-md hover:bg-ns-hover/50 dark:bg-ns-panel/70"
                        >
                          <div className="flex min-w-0 items-center gap-3.5">
                            <div
                              className="flex size-10 shrink-0 items-center justify-center rounded-xl shadow-inner"
                              style={{
                                backgroundColor: `${folderColor}20`,
                                color: folderColor,
                              }}
                            >
                              <Folder size={18} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="truncate text-sm font-bold text-ns-text transition-colors group-hover:text-ns-primary">
                                  {folder.name}
                                </h3>
                                <span className="rounded-full bg-ns-surface-alt px-2 py-0.5 text-[0.65rem] font-semibold text-ns-muted">
                                  {noteCount} notes
                                </span>
                              </div>

                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ns-muted">
                                {tagsList.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    {tagsList.slice(0, 2).map((t: string) => (
                                      <span
                                        key={t}
                                        className="py-0.2 rounded bg-ns-primary/10 px-1.5 text-[10px] font-semibold text-ns-primary dark:text-ns-primary-lt"
                                      >
                                        #{t}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <span className="text-[11px] text-ns-ghost">
                                  Updated{' '}
                                  {formatDate(
                                    folder.updatedAt || folder.createdAt
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) =>
                                handleToggleFolderFavorite(e, folder.id)
                              }
                              className="text-amber-500 hover:bg-ns-hover dark:text-amber-400"
                              title="Remove from favorites"
                            >
                              <Star className="size-4 fill-amber-500 dark:fill-amber-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopyLink(
                                  `/workspace/folder/${folder.id}`,
                                  folder.name
                                )
                              }}
                              className="text-ns-ghost hover:bg-ns-hover hover:text-ns-text"
                              title="Copy link"
                            >
                              <Link2 size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-ns-ghost hover:bg-ns-hover hover:text-ns-text"
                              title="Open folder"
                            >
                              <ArrowUpRight size={14} />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

          {/* ── Notes Section ────────────────────────────────────────── */}
          {(filter === 'all' || filter === 'notes') &&
            filteredNotes.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-ns-border-soft pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-md bg-ns-primary/10 text-ns-primary dark:text-ns-primary-lt">
                      <FileText size={14} />
                    </div>
                    <h2 className="text-sm font-extrabold tracking-wide text-ns-text">
                      Starred Notes
                    </h2>
                    <span className="rounded-full bg-ns-primary/10 px-2 py-0.5 text-[0.65rem] font-bold text-ns-primary dark:text-ns-primary-lt">
                      {filteredNotes.length}
                    </span>
                  </div>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredNotes.map((note) => {
                      const folderInfo = note.folderId
                        ? folderMap.get(note.folderId)
                        : null
                      const tagsList = Array.isArray(note.tags) ? note.tags : []
                      const snippet = cleanSnippet(note.content)

                      return (
                        <div
                          key={note.id}
                          onClick={() => handleOpenNote(note)}
                          className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-ns-border-soft bg-ns-surface p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-ns-primary/50 hover:shadow-lg dark:bg-ns-panel/70 dark:hover:shadow-[0_0_25px_rgba(0,0,0,0.5)]"
                        >
                          <div>
                            {/* Top Header: Folder Pill + Star Button */}
                            <div className="flex items-center justify-between gap-2">
                              {folderInfo ? (
                                <div className="flex items-center gap-1.5 truncate rounded-lg border border-ns-border-soft bg-ns-surface-alt px-2 py-1 text-[11px] font-semibold text-ns-muted">
                                  <Folder
                                    size={12}
                                    style={{
                                      color: folderInfo.color || '#6366f1',
                                    }}
                                  />
                                  <span className="truncate">
                                    {folderInfo.name}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 rounded-lg border border-ns-border-soft bg-ns-surface-alt px-2 py-1 text-[11px] font-semibold text-ns-ghost">
                                  <FileText size={12} />
                                  <span>Standalone Note</span>
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={(e) =>
                                  handleToggleNoteFavorite(e, note.id)
                                }
                                className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-ns-border-soft bg-ns-surface text-amber-500 transition-all hover:scale-110 hover:bg-ns-hover dark:text-amber-400"
                                title="Remove from favorites"
                              >
                                <Star className="size-3.5 fill-amber-500 dark:fill-amber-400" />
                              </button>
                            </div>

                            {/* Title */}
                            <h3 className="mt-3 line-clamp-1 text-base font-bold text-ns-text transition-colors group-hover:text-ns-primary dark:group-hover:text-ns-primary-lt">
                              {note.name}
                            </h3>

                            {/* Excerpt / Content snippet */}
                            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ns-muted">
                              {snippet ||
                                'Empty note content. Click to start editing.'}
                            </p>

                            {/* Tags */}
                            {tagsList.length > 0 && (
                              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                                {tagsList.slice(0, 3).map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="rounded-md border border-ns-border-soft bg-ns-surface-alt px-2 py-0.5 font-mono text-[10px] font-medium text-ns-muted"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {tagsList.length > 3 && (
                                  <span className="text-[10px] font-medium text-ns-ghost">
                                    +{tagsList.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Card Footer */}
                          <div className="mt-4 flex items-center justify-between border-t border-ns-border-soft pt-3 text-xs text-ns-ghost">
                            <span className="flex items-center gap-1 text-[11px]">
                              <Clock size={11} />
                              {formatDate(note.updatedAt || note.createdAt)}
                            </span>

                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCopyLink(
                                    `/workspace/folder/${note.folderId || note.id}`,
                                    note.name
                                  )
                                }}
                                className="text-ns-ghost hover:bg-ns-hover hover:text-ns-text"
                                title="Copy note link"
                              >
                                <Link2 size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-ns-ghost hover:bg-ns-hover hover:text-ns-text"
                                title="Open note"
                              >
                                <ArrowUpRight size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  /* List View for Notes */
                  <div className="flex flex-col gap-2">
                    {filteredNotes.map((note) => {
                      const folderInfo = note.folderId
                        ? folderMap.get(note.folderId)
                        : null
                      const tagsList = Array.isArray(note.tags) ? note.tags : []

                      return (
                        <div
                          key={note.id}
                          onClick={() => handleOpenNote(note)}
                          className="group relative flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-ns-border-soft bg-ns-surface p-3.5 shadow-xs transition-all hover:border-ns-border-md hover:bg-ns-hover/50 dark:bg-ns-panel/70"
                        >
                          <div className="flex min-w-0 items-center gap-3.5">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-ns-primary/20 bg-ns-primary/10 text-ns-primary dark:text-ns-primary-lt">
                              <FileText size={18} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="truncate text-sm font-bold text-ns-text transition-colors group-hover:text-ns-primary dark:group-hover:text-ns-primary-lt">
                                  {note.name}
                                </h3>
                                {folderInfo && (
                                  <span className="hidden items-center gap-1 rounded-full bg-ns-surface-alt px-2 py-0.5 text-[0.65rem] font-medium text-ns-muted sm:inline-flex">
                                    <Folder size={10} />
                                    {folderInfo.name}
                                  </span>
                                )}
                              </div>

                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ns-muted">
                                {tagsList.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    {tagsList.slice(0, 2).map((t: string) => (
                                      <span
                                        key={t}
                                        className="py-0.2 rounded bg-ns-surface-alt px-1.5 text-[10px] font-medium text-ns-muted"
                                      >
                                        #{t}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <span className="text-[11px] text-ns-ghost">
                                  Updated{' '}
                                  {formatDate(note.updatedAt || note.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) =>
                                handleToggleNoteFavorite(e, note.id)
                              }
                              className="text-amber-500 hover:bg-ns-hover dark:text-amber-400"
                              title="Remove from favorites"
                            >
                              <Star className="size-4 fill-amber-500 dark:fill-amber-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopyLink(
                                  `/workspace/folder/${note.folderId || note.id}`,
                                  note.name
                                )
                              }}
                              className="text-ns-ghost hover:bg-ns-hover hover:text-ns-text"
                              title="Copy link"
                            >
                              <Link2 size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-ns-ghost hover:bg-ns-hover hover:text-ns-text"
                              title="Open note"
                            >
                              <ArrowUpRight size={14} />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
        </div>
      )}
    </div>
  )
}
