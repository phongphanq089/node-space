import { useState, useMemo } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Folder,
  FileText,
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  X,
  Clock,
  Check,
  CheckSquare,
  Square,
} from 'lucide-react'
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ShowcaseEmptyState,
} from '@/shared/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/core/dropdown-menu'
import { Skeleton } from '@/shared/ui/core/skeleton'
import {
  useNotesQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '@/features/notes'
import { useFoldersQuery } from '@/features/folder'
import { toast } from 'sonner'
import { cn } from '@/shared/lib/utils'

export const Route = createFileRoute('/_workspace/workspace/trash')({
  component: TrashPage,
})

const RETENTION_DAYS = 30

interface RemainingDaysInfo {
  days: number
  label: string
  isUrgent: boolean
}

const getRemainingDays = (
  dateValue?: Date | string | null
): RemainingDaysInfo => {
  if (!dateValue) {
    return {
      days: RETENTION_DAYS,
      label: `${RETENTION_DAYS} days left`,
      isUrgent: false,
    }
  }
  try {
    const deletedTime = new Date(dateValue).getTime()
    const now = Date.now()
    const diffDays = Math.floor((now - deletedTime) / (1000 * 60 * 60 * 24))
    const remaining = Math.max(0, RETENTION_DAYS - diffDays)

    if (remaining === 0) {
      return { days: 0, label: 'Expires today', isUrgent: true }
    }
    if (remaining === 1) {
      return { days: 1, label: 'Expires tomorrow', isUrgent: true }
    }
    return {
      days: remaining,
      label: `${remaining} days left`,
      isUrgent: remaining <= 5,
    }
  } catch {
    return {
      days: RETENTION_DAYS,
      label: `${RETENTION_DAYS} days left`,
      isUrgent: false,
    }
  }
}

type SortType =
  'expiring_asc' | 'deleted_desc' | 'deleted_asc' | 'name_asc' | 'name_desc'
type ViewMode = 'grid' | 'list'

const SORT_LABELS: Record<SortType, string> = {
  expiring_asc: 'Expiring Soonest',
  deleted_desc: 'Recently Deleted',
  deleted_asc: 'Oldest Deleted',
  name_asc: 'Name (A to Z)',
  name_desc: 'Name (Z to A)',
}

function TrashPage() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortType>('deleted_desc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Modal dialog states
  const [confirmEmptyOpen, setConfirmEmptyOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{
    id: string
    name: string
  } | null>(null)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [isBulkRestoring, setIsBulkRestoring] = useState(false)

  // Real backend queries
  const { data: trashNotes = [], isLoading: isLoadingNotes } = useNotesQuery({
    isTrash: true,
  })
  const { data: allFolders = [] } = useFoldersQuery()

  const updateNoteMutation = useUpdateNoteMutation()
  const deleteNoteMutation = useDeleteNoteMutation()

  // Mapping folder lookup by ID
  const folderMap = useMemo(() => {
    const map = new Map<string, { name: string; color?: string | null }>()
    for (const f of allFolders) {
      map.set(f.id, { name: f.name, color: f.color })
    }
    return map
  }, [allFolders])

  // Filter & Search
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    const list = trashNotes.filter((n) => {
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
      if (sortBy === 'expiring_asc') {
        const remA = getRemainingDays(a.updatedAt || a.createdAt).days
        const remB = getRemainingDays(b.updatedAt || b.createdAt).days
        return remA - remB
      }
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name)
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return sortBy === 'deleted_desc' ? dateB - dateA : dateA - dateB
    })
  }, [trashNotes, search, sortBy])

  // Single Item Actions
  const handleRestore = (id: string, name: string) => {
    updateNoteMutation.mutate(
      { id, isTrash: false },
      {
        onSuccess: () => {
          setSelectedIds((prev) => {
            const next = new Set(prev)
            next.delete(id)
            return next
          })
          toast.success(`Restored "${name}" to workspace`)
        },
      }
    )
  }

  const handleDeletePermanent = (id: string, name: string) => {
    deleteNoteMutation.mutate(
      { noteId: id, permanent: true },
      {
        onSuccess: () => {
          setItemToDelete(null)
          setSelectedIds((prev) => {
            const next = new Set(prev)
            next.delete(id)
            return next
          })
          toast.error(`Permanently deleted "${name}"`)
        },
      }
    )
  }

  // Bulk Actions
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredItems.map((i) => i.id)))
    }
  }

  const handleBulkRestore = async () => {
    if (selectedIds.size === 0) return
    setIsBulkRestoring(true)
    const count = selectedIds.size
    try {
      for (const id of selectedIds) {
        await updateNoteMutation.mutateAsync({ id, isTrash: false })
      }
      setSelectedIds(new Set())
      toast.success(`Restored ${count} items to workspace!`)
    } catch {
      toast.error('Failed to restore some items')
    } finally {
      setIsBulkRestoring(false)
    }
  }

  const handleBulkDeletePermanent = async () => {
    if (selectedIds.size === 0) return
    setIsBulkDeleting(true)
    const count = selectedIds.size
    try {
      for (const id of selectedIds) {
        await deleteNoteMutation.mutateAsync({ noteId: id, permanent: true })
      }
      setSelectedIds(new Set())
      toast.error(`Permanently deleted ${count} items!`)
    } catch {
      toast.error('Failed to delete some items')
    } finally {
      setIsBulkDeleting(false)
    }
  }

  const handleEmptyTrash = async () => {
    const count = trashNotes.length
    try {
      for (const item of trashNotes) {
        await deleteNoteMutation.mutateAsync({
          noteId: item.id,
          permanent: true,
        })
      }
      setConfirmEmptyOpen(false)
      setSelectedIds(new Set())
      toast.success(`Emptied trash (${count} items removed permanently)`)
    } catch {
      toast.error('Failed to empty trash')
    }
  }

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

  return (
    <div className="flex flex-1 flex-col gap-6 p-3 font-sans sm:p-6 lg:p-8">
      {/* ── Top Hero Header ────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-ns-border-md bg-ns-surface/80 p-6 shadow-sm backdrop-blur-xl transition-all sm:p-8 dark:bg-ns-surface/90 dark:shadow-2xl">
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-amber-500/10 opacity-70 blur-3xl dark:bg-amber-500/20 dark:opacity-40" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-rose-500/10 opacity-70 blur-3xl dark:bg-rose-500/20 dark:opacity-40" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Trash2 className="size-3.5" />
              <span>Temporary Archive & Retention</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-ns-text sm:text-3xl lg:text-4xl">
              Trash Bin
            </h1>

            <p className="max-w-xl text-xs leading-relaxed text-ns-muted sm:text-sm">
              Deleted notes and resources are kept here temporarily. You can
              restore them back to your workspace or delete them permanently.
            </p>
          </div>

          {/* Realtime KPI Counters & Empty Trash Action */}
          <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
            {trashNotes.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => setConfirmEmptyOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-red-500 active:scale-95"
              >
                <Trash2 size={15} />
                <span>Empty Trash</span>
              </Button>
            )}

            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-ns-border-soft bg-ns-bg/80 px-4 py-2.5 shadow-xs backdrop-blur-md sm:min-w-24 sm:flex-initial">
              <span className="text-xl font-extrabold text-ns-text">
                {isLoadingNotes ? '...' : trashNotes.length}
              </span>
              <span className="text-[0.65rem] font-bold tracking-wider text-ns-ghost uppercase">
                Deleted Items
              </span>
            </div>

            <div className="hidden min-w-28 flex-col items-center justify-center rounded-xl border border-ns-border-soft bg-ns-bg/80 px-4 py-2.5 shadow-xs backdrop-blur-md sm:flex">
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-amber-500" />
                <span className="text-sm font-extrabold text-ns-text">
                  30 Days
                </span>
              </div>
              <span className="text-[0.65rem] font-bold tracking-wider text-ns-ghost uppercase">
                Auto-Purge
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Auto-Purge Policy Alert Banner ─────────────────────────── */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-700 shadow-xs backdrop-blur-md dark:text-amber-300">
        <AlertTriangle className="size-5 shrink-0 animate-pulse text-amber-600 dark:text-amber-400" />
        <div className="flex-1 leading-relaxed">
          <span className="font-bold">Auto-Purge Warning:</span> Items remaining
          in the trash are preserved for safe recovery. To free up storage, you
          can purge items manually or empty the trash bin at any time.
        </div>
      </div>

      {/* ── Search & Filter Controls Bar ────────────────────────────── */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search input */}
        <div className="relative w-full lg:max-w-sm">
          <Input
            placeholder="Search deleted items by name, content, tag..."
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

        {/* Right Controls: Sort Dropdown & View Mode */}
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          {filteredItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="gap-1.5 border-ns-border-soft bg-ns-surface text-xs text-ns-text shadow-xs hover:bg-ns-hover"
            >
              {selectedIds.size === filteredItems.length ? (
                <CheckSquare size={14} className="text-ns-primary" />
              ) : (
                <Square size={14} className="text-ns-ghost" />
              )}
              <span>
                {selectedIds.size === filteredItems.length
                  ? 'Deselect All'
                  : 'Select All'}
              </span>
            </Button>
          )}

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-ns-border-soft bg-ns-surface text-xs text-ns-text shadow-xs hover:bg-ns-hover"
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

          {/* View Mode Toggle */}
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
              title="Grid Cards View"
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

      {/* ── Batch Actions Bar (Floating / Inline) ──────────────────── */}
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ns-primary/30 bg-ns-primary/10 p-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-ns-primary text-xs font-bold text-white">
              {selectedIds.size}
            </span>
            <span className="text-xs font-bold text-ns-text">
              {selectedIds.size === 1 ? 'item selected' : 'items selected'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkRestore}
              disabled={isBulkRestoring}
              className="gap-1.5 border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-600 shadow-xs hover:bg-emerald-500/20 dark:text-emerald-400"
            >
              <RotateCcw
                size={13}
                className={isBulkRestoring ? 'animate-spin' : ''}
              />
              <span>Restore Selected ({selectedIds.size})</span>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDeletePermanent}
              disabled={isBulkDeleting}
              className="gap-1.5 bg-red-600 text-xs font-semibold text-white shadow-xs hover:bg-red-500"
            >
              <Trash2
                size={13}
                className={isBulkDeleting ? 'animate-spin' : ''}
              />
              <span>Delete Permanently</span>
            </Button>
          </div>
        </div>
      )}

      {/* ── Content Grid / List ────────────────────────────────────── */}
      {isLoadingNotes ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-2xl border border-ns-border-soft bg-ns-surface/50 p-4 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              </div>
              <Skeleton className="mt-2 h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ns-border-md bg-ns-surface/40 px-6 py-16 text-center shadow-xs backdrop-blur-sm">
          {search ? (
            <>
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-500 shadow-lg shadow-amber-500/5">
                <Search className="size-8" />
              </div>
              <h2 className="text-lg font-bold text-ns-text">
                No Matching Deleted Items
              </h2>
              <p className="mt-1.5 max-w-md text-xs leading-relaxed text-ns-muted">
                We couldn't find any deleted items matching "{search}".
              </p>
              <Button
                variant="outline"
                onClick={() => setSearch('')}
                className="mt-6 border-ns-border-soft bg-ns-surface text-ns-text hover:bg-ns-hover"
              >
                <span>Clear Search</span>
              </Button>
            </>
          ) : (
            <ShowcaseEmptyState
              badgeText="Workspace Retention"
              title={
                <>
                  Trash is completely clean —{' '}
                  <span className="font-extrabold text-ns-text">
                    all items safe
                  </span>{' '}
                  in workspace.
                </>
              }
              description="No deleted notes or files are currently in the retention bin. Your workspace is tidy and organized."
              primaryAction={{
                label: 'Browse Workspace Folders',
                onClick: () => navigate({ to: '/workspace/folder' as any }),
                icon: <Folder size={15} />,
              }}
              secondaryAction={{
                label: 'Go to Workspace Home',
                onClick: () => navigate({ to: '/workspace' as any }),
              }}
            />
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* ── Grid View ────────────────────────────────────────────── */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const isSelected = selectedIds.has(item.id)
            const parentFolder = item.folderId
              ? folderMap.get(item.folderId)
              : null
            const tagsList = Array.isArray(item.tags) ? item.tags : []
            const remaining = getRemainingDays(item.updatedAt || item.createdAt)

            return (
              <div
                key={item.id}
                onClick={() => handleToggleSelect(item.id)}
                className={cn(
                  'group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all duration-200 outline-none',
                  isSelected
                    ? 'border-ns-primary bg-ns-primary/10 shadow-md ring-1 ring-ns-primary/40'
                    : 'border-ns-border-soft bg-ns-surface hover:border-ns-border-md hover:bg-ns-hover/80 hover:shadow-md'
                )}
              >
                {/* Card Top: Checkbox & Info */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ns-primary/10 text-ns-primary shadow-inner dark:text-ns-primary-lt">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded-md border border-ns-border-soft bg-ns-surface-alt px-2 py-0.5 font-mono text-[10px] font-bold text-ns-muted uppercase">
                            Note
                          </span>
                          <span
                            className={cn(
                              'flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold',
                              remaining.isUrgent
                                ? 'animate-pulse border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                : 'border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            )}
                            title={`Auto-purges 30 days after deletion (${remaining.label})`}
                          >
                            <Clock size={10} />
                            <span>{remaining.label}</span>
                          </span>
                        </div>
                        {parentFolder && (
                          <div className="mt-1 flex items-center gap-1 truncate text-[11px] text-ns-ghost">
                            <Folder
                              size={11}
                              className="shrink-0 text-blue-500"
                            />
                            <span className="truncate">
                              {parentFolder.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleSelect(item.id)
                      }}
                      className="cursor-pointer p-1 text-ns-ghost transition-colors hover:text-ns-primary"
                    >
                      {isSelected ? (
                        <CheckSquare size={18} className="text-ns-primary" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3.5 line-clamp-1 text-base font-bold text-ns-text transition-colors group-hover:text-ns-primary">
                    {item.name}
                  </h3>

                  {/* Content snippet */}
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ns-muted">
                    {item.content
                      ? item.content.replace(/<[^>]*>?/gm, '')
                      : 'No content'}
                  </p>

                  {/* Tags */}
                  {tagsList.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {tagsList.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-md border border-ns-border-soft bg-ns-surface-alt px-1.5 py-0.5 font-mono text-[10px] font-medium text-ns-ghost"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Metadata & Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-ns-border-soft/60 pt-3">
                  <span className="flex items-center gap-1 text-[11px] text-ns-ghost">
                    <Clock size={11} />
                    Deleted {formatDate(item.updatedAt || item.createdAt)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRestore(item.id, item.name)
                      }}
                      className="h-8 gap-1 border-ns-border-soft bg-ns-surface text-xs font-semibold text-emerald-600 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-500 dark:text-emerald-400"
                      title="Restore note to workspace"
                    >
                      <RotateCcw size={12} />
                      <span>Restore</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setItemToDelete({ id: item.id, name: item.name })
                      }}
                      className="size-8 text-ns-ghost hover:bg-red-500/10 hover:text-red-500"
                      title="Delete permanently"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ── List View ────────────────────────────────────────────── */
        <div className="flex flex-col gap-2">
          {filteredItems.map((item) => {
            const isSelected = selectedIds.has(item.id)
            const parentFolder = item.folderId
              ? folderMap.get(item.folderId)
              : null
            const remaining = getRemainingDays(item.updatedAt || item.createdAt)

            return (
              <div
                key={item.id}
                onClick={() => handleToggleSelect(item.id)}
                className={cn(
                  'group relative flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-3.5 shadow-xs transition-all duration-200',
                  isSelected
                    ? 'border-ns-primary bg-ns-primary/10 shadow-md ring-1 ring-ns-primary/40'
                    : 'border-ns-border-soft bg-ns-surface hover:border-ns-border-md hover:bg-ns-hover'
                )}
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleSelect(item.id)
                    }}
                    className="cursor-pointer text-ns-ghost transition-colors hover:text-ns-primary"
                  >
                    {isSelected ? (
                      <CheckSquare size={16} className="text-ns-primary" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>

                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ns-primary/10 text-ns-primary dark:text-ns-primary-lt">
                    <FileText size={16} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate text-sm font-bold text-ns-text group-hover:text-ns-primary">
                        {item.name}
                      </h4>
                      <span className="py-0.2 rounded-md bg-ns-surface-alt px-1.5 font-mono text-[10px] font-semibold text-ns-ghost uppercase">
                        Note
                      </span>
                      <span
                        className={cn(
                          'py-0.2 hidden shrink-0 items-center gap-1 rounded-md border px-1.5 font-mono text-[10px] font-bold sm:flex',
                          remaining.isUrgent
                            ? 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : 'border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        )}
                        title={`Auto-purges 30 days after deletion (${remaining.label})`}
                      >
                        <Clock size={9} />
                        <span>{remaining.label}</span>
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-2 text-xs text-ns-muted">
                      {parentFolder && (
                        <>
                          <span className="max-w-40 truncate text-ns-ghost">
                            in {parentFolder.name}
                          </span>
                          <span>•</span>
                        </>
                      )}
                      <span className="text-[11px] text-ns-ghost">
                        Deleted {formatDate(item.updatedAt || item.createdAt)}
                      </span>
                      <span className="text-[11px] font-semibold text-amber-600 sm:hidden dark:text-amber-400">
                        • {remaining.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRestore(item.id, item.name)
                    }}
                    className="h-8 gap-1.5 border-ns-border-soft bg-ns-surface text-xs font-semibold text-emerald-600 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-500 dark:text-emerald-400"
                    title="Restore item"
                  >
                    <RotateCcw size={12} />
                    <span className="hidden sm:inline">Restore</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setItemToDelete({ id: item.id, name: item.name })
                    }}
                    className="size-8 text-ns-ghost hover:bg-red-500/10 hover:text-red-500"
                    title="Delete permanently"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Single Item Permanent Delete Confirmation Modal ─────────── */}
      <Dialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <DialogContent className="border border-red-500/30 bg-ns-surface/95 p-6 shadow-2xl backdrop-blur-2xl sm:max-w-md">
          <DialogHeader className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-500 shadow-md">
              <AlertTriangle className="size-6" />
            </div>
            <DialogTitle className="text-base font-bold text-ns-text">
              Permanently Delete Item?
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed text-ns-muted">
              Are you sure you want to permanently remove{' '}
              <strong className="text-ns-text">"{itemToDelete?.name}"</strong>?
              This action cannot be undone and data will be erased forever.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setItemToDelete(null)}
              className="border-ns-border-soft text-ns-muted hover:text-ns-text"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (itemToDelete) {
                  handleDeletePermanent(itemToDelete.id, itemToDelete.name)
                }
              }}
              className="gap-1.5 bg-red-600 font-semibold text-white shadow-md hover:bg-red-500"
            >
              <Trash2 size={14} />
              <span>Delete Permanently</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Empty Entire Trash Confirmation Modal ──────────────────── */}
      <Dialog open={confirmEmptyOpen} onOpenChange={setConfirmEmptyOpen}>
        <DialogContent className="border border-red-500/30 bg-ns-surface/95 p-6 shadow-2xl backdrop-blur-2xl sm:max-w-md">
          <DialogHeader className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-500 shadow-md">
              <Trash2 className="size-6" />
            </div>
            <DialogTitle className="text-base font-bold text-ns-text">
              Empty Entire Trash Bin?
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed text-ns-muted">
              This action cannot be undone. All {trashNotes.length} items
              currently in the trash bin will be permanently erased from your
              workspace.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setConfirmEmptyOpen(false)}
              className="border-ns-border-soft text-ns-muted hover:text-ns-text"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleEmptyTrash}
              className="gap-1.5 bg-red-600 font-semibold text-white shadow-md hover:bg-red-500"
            >
              <Trash2 size={14} />
              <span>Empty Trash Now</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
